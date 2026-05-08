import azure.functions as func
import logging
import os
import json
import urllib.request
import urllib.error
from datetime import datetime, timedelta, timezone
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame
from alpaca.data.enums import DataFeed

app = func.FunctionApp()

# ── Config ────────────────────────────────────────────────────────────────────
SYMBOL    = "SPY"
BAR_LIMIT = 30          # 30 one-minute bars fed into Chronos


# ── Market Data ───────────────────────────────────────────────────────────────
def get_alpaca_bars(symbol: str = SYMBOL, limit: int = BAR_LIMIT) -> list[float]:
    """
    Fetch the last `limit` 1-minute closing prices from Alpaca via official SDK.
    Returns an ordered list of floats (oldest → newest) for Chronos input.
    """
    key_id     = os.environ.get("ALPACA_KEY_ID", "")
    secret_key = os.environ.get("ALPACA_SECRET_KEY", "")

    if not key_id or not secret_key:
        logging.warning("[harvester] Alpaca credentials not configured — skipping")
        return []

    try:
        client = StockHistoricalDataClient(key_id, secret_key)
        end    = datetime.now(timezone.utc)
        start  = end - timedelta(minutes=limit + 10)   # buffer for gaps

        request = StockBarsRequest(
            symbol_or_symbols=symbol,
            timeframe=TimeFrame.Minute,
            start=start,
            end=end,
            limit=limit,
            feed=DataFeed.IEX,   # Free plan only — SIP requires paid subscription
        )
        bars   = client.get_stock_bars(request)
        closes = [float(bar.close) for bar in bars[symbol]]

        logging.info(f"[harvester] Alpaca: {len(closes)} bars fetched for {symbol}")
        return closes

    except Exception as e:
        logging.error(f"[harvester] Alpaca error: {e}")
        return []


# ── AI Inference ──────────────────────────────────────────────────────────────
def get_naive_forecast(price_series: list[float], steps: int = 5) -> list[list[float]] | None:
    """
    In-process momentum forecast that produces output in the same nested-quantile
    shape Chronos returns: [q10_steps, q50_steps, q90_steps].

    Method: linear regression slope of the last N closes, projected forward.
    Volatility bands (q10/q90) derived from sample standard deviation of residuals.

    Why this exists: HuggingFace deprecated the free Chronos Inference endpoint
    in 2025. Until we self-host Chronos / Kronos on Azure Container Apps, this
    naive forecaster keeps the signal pipeline producing live data so the
    frontend, SQL persistence, and Web PubSub broadcast can all be exercised.

    Self-hosted Chronos is tracked as a follow-up. When ready, only this function
    swaps; parse_momentum_signal() and downstream stay unchanged.

    Replace by pointing this function at a Container Apps endpoint:
        url = os.environ.get("CHRONOS_INFERENCE_URL", "")
        ...standard HTTPS POST...
    """
    n = len(price_series)
    if n < 5:
        return None

    # Linear regression on indices 0..n-1 → slope + intercept
    xs = list(range(n))
    mean_x = sum(xs) / n
    mean_y = sum(price_series) / n
    num = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, price_series))
    den = sum((x - mean_x) ** 2 for x in xs) or 1.0
    slope = num / den
    intercept = mean_y - slope * mean_x

    # Residuals (in-sample stddev) for confidence band
    residuals = [(price_series[i] - (intercept + slope * i)) for i in range(n)]
    var = sum(r * r for r in residuals) / max(1, n - 1)
    stddev = var ** 0.5

    # Project `steps` minutes forward; widen band linearly with horizon
    last_idx = n - 1
    q50: list[float] = []
    q10: list[float] = []
    q90: list[float] = []
    for k in range(1, steps + 1):
        center = intercept + slope * (last_idx + k)
        widen  = stddev * (1.0 + 0.4 * k)   # mild fan-out
        q50.append(round(center, 4))
        q10.append(round(center - 1.28 * widen, 4))
        q90.append(round(center + 1.28 * widen, 4))

    return [q10, q50, q90]


# ── Signal Parser ─────────────────────────────────────────────────────────────
def parse_momentum_signal(forecast: list, last_price: float) -> dict | None:
    """
    Convert Chronos-Bolt quantile output into a structured momentum signal
    designed for downstream Three.js chart consumption.

    Chronos returns nested quantile arrays:
        [[q10_step1, ...],   <- pessimistic floor
         [q50_step1, ...],   <- median (direction + confidence)
         [q90_step1, ...]]   <- optimistic ceiling

    Signal schema for frontend chart consumption:
        direction:   "UP" | "DOWN"
        confidence:  0-100  (% of median steps beating last_price)
        mean_target: float  (average predicted price)
        pct_change:  float  (signed expected % move)
        bull_range:  float  (q90 mean — optimistic ceiling)
        bear_range:  float  (q10 mean — pessimistic floor)
        steps:       int
        symbol:      str
        timestamp:   ISO 8601 UTC
    """
    if not forecast or last_price == 0:
        return None

    try:
        # Normalise: Chronos may return nested quantiles or a flat list
        if isinstance(forecast[0], list):
            n            = len(forecast)
            bear_preds   = forecast[0]        # q10 — pessimistic
            median_preds = forecast[n // 2]   # q50 — central estimate
            bull_preds   = forecast[-1]       # q90 — optimistic
        else:
            median_preds = forecast
            bear_preds   = forecast
            bull_preds   = forecast

        if not median_preds:
            return None

        steps_above = sum(1 for p in median_preds if p > last_price)
        confidence  = round((steps_above / len(median_preds)) * 100)
        mean_target = sum(median_preds) / len(median_preds)
        direction   = "UP" if mean_target > last_price else "DOWN"
        pct_change  = round((mean_target - last_price) / last_price * 100, 4)
        bull_range  = round(sum(bull_preds)   / len(bull_preds),   4)
        bear_range  = round(sum(bear_preds)   / len(bear_preds),   4)

        return {
            "direction":   direction,
            "confidence":  confidence,
            "mean_target": round(mean_target, 4),
            "pct_change":  pct_change,
            "bull_range":  bull_range,
            "bear_range":  bear_range,
            "steps":       len(median_preds),
            "symbol":      SYMBOL,
            "timestamp":   datetime.now(timezone.utc).isoformat(),
        }

    except Exception as e:
        logging.error(f"[harvester] Signal parse error: {e}")
        return None


# ── Ingest: POST signal to Catalyst Wire API ─────────────────────────────────
def post_signal_to_api(signal: dict, last_price: float, model: str = "chronos-bolt-small") -> bool:
    """
    POST the parsed signal to the Catalyst Wire Next.js API at /api/signals/ingest.
    The API persists to Azure SQL and broadcasts via Web PubSub.

    Auth: X-Cron-Secret header. Best-effort — failures don't break the harvester tick.
    """
    api_url = os.environ.get("CATALYST_API_URL", "").rstrip("/")
    secret  = os.environ.get("CRON_SECRET", "")

    if not api_url or not secret:
        logging.warning("[harvester] CATALYST_API_URL or CRON_SECRET missing — skipping ingest")
        return False

    payload = {
        "symbol":      signal["symbol"],
        "direction":   signal["direction"],
        "confidence":  signal["confidence"],
        "last_price":  round(last_price, 4),
        "mean_target": signal["mean_target"],
        "pct_change":  signal["pct_change"],
        "bull_range":  signal["bull_range"],
        "bear_range":  signal["bear_range"],
        "steps":       signal["steps"],
        "model":       model,
    }

    req = urllib.request.Request(
        f"{api_url}/api/signals/ingest",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type":   "application/json",
            "X-Cron-Secret":  secret,
            "User-Agent":     "CatalystHarvester/1.0",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            logging.info(f"[harvester] Ingest OK — id={data.get('id', '?')}")
            return True
    except urllib.error.HTTPError as e:
        logging.error(f"[harvester] Ingest HTTP {e.code}: {e.read().decode(errors='replace')[:200]}")
        return False
    except Exception as e:
        logging.error(f"[harvester] Ingest error: {e}")
        return False


# ── Timer Trigger ─────────────────────────────────────────────────────────────
@app.schedule(schedule="0 */1 * * * *", arg_name="myTimer", run_on_startup=True)
def catalyst_harvester_timer(myTimer: func.TimerRequest) -> None:
    logging.info(f"[harvester] Tick — {datetime.now(timezone.utc).isoformat()}")

    closes = get_alpaca_bars()
    if not closes:
        logging.warning("[harvester] No price data — aborting tick")
        return

    forecast = get_naive_forecast(closes, steps=5)
    if not forecast:
        logging.warning("[harvester] No forecast — aborting tick")
        return

    last_price = closes[-1]
    signal = parse_momentum_signal(forecast, last_price=last_price)
    if not signal:
        logging.warning("[harvester] Could not parse momentum signal")
        return

    logging.info(
        f"[harvester] {signal['symbol']} | "
        f"{signal['direction']} | "
        f"Confidence: {signal['confidence']}% | "
        f"Target: ${signal['mean_target']} "
        f"({'+' if signal['pct_change'] >= 0 else ''}{signal['pct_change']}%) | "
        f"Range: ${signal['bear_range']} – ${signal['bull_range']}"
    )

    # Persist + broadcast via Catalyst Wire API
    post_signal_to_api(signal, last_price=last_price, model="naive_momentum_v1")
