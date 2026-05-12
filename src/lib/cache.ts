/**
 * Redis Cache Layer — centralized caching for performance + live data.
 * Secret: REDIS-URL (from Azure Key Vault)
 */
import { createClient } from "redis";
import { getSecret } from "./azure-secrets";

let _client: ReturnType<typeof createClient> | null = null;

async function getRedisUrl(): Promise<string | null> {
  try {
    return await getSecret("REDIS-URL");
  } catch {
    console.warn("[redis] REDIS-URL not available in Key Vault");
    return null;
  }
}

async function getClient() {
  if (_client?.isOpen) return _client;

  const url = await getRedisUrl();
  if (!url) return null;

  try {
    _client = createClient({ url });
    _client.on("error", (e) => console.error("[redis]", e.message));
    await _client.connect();
    console.log("[redis] Connected successfully");
    return _client;
  } catch (e) {
    console.error("[redis] connect failed:", e);
    _client = null;
    return null;
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const c = await getClient();
    if (!c) return null;
    const raw = await c.get(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch { 
    return null; 
  }
}

export async function cacheSet(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  try {
    const c = await getClient();
    if (!c) return;
    await c.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch { 
    /* non-fatal */ 
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    const c = await getClient();
    if (!c) return;
    await c.del(key);
  } catch { 
    /* non-fatal */ 
  }
}

/** Fetch with Redis cache — falls back to fetcher() on miss or Redis unavailable */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}
