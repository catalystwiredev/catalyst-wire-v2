import azure.functions as func
import logging
import os
import json
from datetime import datetime, timedelta, timezone
from huggingface_hub import InferenceClient
from alpaca.data.historical import StockHistoricalDataClient
from alpaca.data.requests import StockBarsRequest
from alpaca.data.timeframe import TimeFrame

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
        )
        bars   = client.get_stock_bars(request)
        closes = [float(bar.close) for bar in bars[symbol]]

        logging.info(f"[harvester] Alpaca: {len(closes)} bars fetched for {symbol}")
        return closes

    except Exception as e:
        logging.error(f"[harvester] Alpaca error: {e}")
        return []


# ── AI Inference ──────────────────────────────────────────────────────────────
def get_chronos_forecast(price_series: list[float]) -> list | None:
    """
    POST price_series to amazon/chronos-bolt-small via HuggingFace Inference API.
    Returns the raw forecast payload (nested quantile arrays) or None on failure.
    """
    if not price_series:
        return None

    hf_token = os.environ.get("HUGGINGFACE_API_KEY")
    if not hf_token:
        logging.warning("[harvester] HUGGINGFACE_API_KEY not set — skipping inference")
        return None

    try:
        client   = InferenceClient(token=hf_token)
        response = client.post(
            json={"inputs": price_series},
            model="amazon/chronos-bolt-small",
        )
        return json.loads(response.decode())

    except Exception as e:
        logging.error(f"[harvester] Chronos inference error: {e}")
        return None


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


# ── Timer Trigger ─────────────────────────────────────────────────────────────
@app.schedule(schedule="0 */1 * * * *", arg_name="myTimer", run_on_startup=True)
def catalyst_harvester_timer(myTimer: func.TimerRequest) -> None:
    logging.info(f"[harvester] Tick — {datetime.now(timezone.utc).isoformat()}")

    closes = get_alpaca_bars()
    if not closes:
        logging.warning("[harvester] No price data — aborting tick")
        return

    forecast = get_chronos_forecast(closes)
    if not forecast:
        logging.warning("[harvester] No Chronos forecast — aborting tick")
        return

    signal = parse_momentum_signal(forecast, last_price=closes[-1])
    if signal:
        logging.info(
            f"[harvester] {signal['symbol']} | "
            f"{signal['direction']} | "
            f"Confidence: {signal['confidence']}% | "
            f"Target: ${signal['mean_target']} "
            f"({'+' if signal['pct_change'] >= 0 else ''}{signal['pct_change']}%) | "
            f"Range: ${signal['bear_range']} – ${signal['bull_range']}"
        )
    else:
        logging.warning("[harvester] Could not parse momentum signal")
