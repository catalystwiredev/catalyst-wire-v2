/**
 * CoinGecko API — free tier (30 req/min, no key), Pro available
 * Env: COINGECKO_API_KEY (optional, for Pro/higher limits)
 * Docs: https://docs.coingecko.com/reference/introduction
 */

const BASE = "https://api.coingecko.com/api/v3";
const PRO  = "https://pro-api.coingecko.com/api/v3";

function getBase() { return process.env.COINGECKO_API_KEY ? PRO : BASE; }

function headers(): Record<string, string> {
  const k = process.env.COINGECKO_API_KEY;
  return k ? { "x-cg-pro-api-key": k } : {};
}

export interface CryptoPrice {
  id:            string;
  symbol:        string;
  name:          string;
  current_price: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap:    number;
  volume_24h:    number;
  high_24h:      number;
  low_24h:       number;
  ath:           number;
  ath_change_percentage: number;
  last_updated:  string;
}

export interface CryptoNews {
  title:       string;
  description: string;
  url:         string;
  publishedAt: string;
  author:      string;
}

/** Get prices for multiple crypto coins by their CoinGecko ID */
export async function getCryptoPrices(coinIds: string[] = ["bitcoin","ethereum","solana","chainlink","uniswap","avalanche-2"]): Promise<CryptoPrice[]> {
  const ids = coinIds.join(",");
  const url = `${getBase()}/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`;
  const res  = await fetch(url, { next: { revalidate: 60 }, headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return (data ?? []).map((c: any) => ({
    id:                          c.id,
    symbol:                      c.symbol?.toUpperCase(),
    name:                        c.name,
    current_price:               c.current_price,
    price_change_24h:            c.price_change_24h,
    price_change_percentage_24h: c.price_change_percentage_24h,
    market_cap:                  c.market_cap,
    volume_24h:                  c.total_volume,
    high_24h:                    c.high_24h,
    low_24h:                     c.low_24h,
    ath:                         c.ath,
    ath_change_percentage:       c.ath_change_percentage,
    last_updated:                c.last_updated,
  }));
}

/** Get top trending coins (last 24h CoinGecko trending) */
export async function getTrendingCoins(): Promise<{ id: string; name: string; symbol: string; market_cap_rank: number }[]> {
  const res = await fetch(`${getBase()}/search/trending`, { next: { revalidate: 300 }, headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.coins ?? []).map((c: any) => ({
    id:              c.item?.id,
    name:            c.item?.name,
    symbol:          c.item?.symbol?.toUpperCase(),
    market_cap_rank: c.item?.market_cap_rank,
  }));
}

/** Get latest crypto news from CoinGecko */
export async function getCryptoNews(limit = 10): Promise<CryptoNews[]> {
  const res = await fetch(`${getBase()}/news?per_page=${limit}`, { next: { revalidate: 120 }, headers: headers() });
  if (!res.ok) return [];
  const data = await res.json();
  return (data?.data ?? []).map((n: any) => ({
    title:       n.title,
    description: n.description,
    url:         n.url,
    publishedAt: n.published_at,
    author:      n.author ?? "CoinGecko",
  }));
}

/** Fetch OHLCV data for a coin (for charting) */
export async function getCoinOHLC(coinId: string, days: 1 | 7 | 14 | 30 = 7): Promise<[number,number,number,number,number][]> {
  const url = `${getBase()}/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
  const res  = await fetch(url, { next: { revalidate: 300 }, headers: headers() });
  if (!res.ok) return [];
  return res.json();
}
