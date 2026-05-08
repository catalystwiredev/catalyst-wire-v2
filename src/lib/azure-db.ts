import { Connection, Request, TYPES } from "tedious";

export function getConnection(): Promise<Connection> {
  return new Promise((resolve, reject) => {
    const conn = new Connection({
      server: process.env.AZURE_SQL_SERVER!,
      authentication: { type: "default" as const, options: { userName: process.env.AZURE_SQL_USER!, password: process.env.AZURE_SQL_PASSWORD! } },
      options: { database: process.env.AZURE_SQL_DATABASE!, encrypt: true, trustServerCertificate: false, connectTimeout: 30000, requestTimeout: 30000 },
    });
    conn.on("connect", (err) => { if (err) reject(err); else resolve(conn); });
    conn.connect();
  });
}

export interface Catalyst {
  Ticker?: string; ticker?: string;
  EventType?: string; type?: string;
  Description?: string; description?: string;
  Verdict?: string; verdict?: string;
  ImpactScore?: number; impactScore?: number;
  IsPremium?: boolean; isPremium?: boolean;
}

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  plan: string;
  plan_status: string;
  plan_interval: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

export async function getCatalysts(opts: { premiumOnly?: boolean; limit?: number } = {}): Promise<Catalyst[]> {
  const { premiumOnly = false, limit = 50 } = opts;
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const rows: Catalyst[] = [];
    let sql = `SELECT TOP (@limit) Ticker, EventType, Description, Verdict, ImpactScore, IsPremium FROM Catalysts WHERE 1=1`;
    if (premiumOnly) sql += " AND IsPremium = 1";
    sql += " ORDER BY ImpactScore DESC";
    const req = new Request(sql, (err) => { conn.close(); if (err) reject(err); else resolve(rows); });
    req.addParameter("limit", TYPES.Int, Math.min(limit, 200));
    req.on("row", (cols) => { const r: any = {}; cols.forEach((c: any) => { r[c.metadata.colName] = c.value; }); rows.push(r); });
    conn.execSql(req);
  });
}

export async function insertCatalyst(data: { ticker: string; eventType: string; description: string; verdict: string; impactScore: number; isPremium: boolean }): Promise<void> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const req = new Request(
      `INSERT INTO Catalysts (Ticker, EventType, Description, Verdict, ImpactScore, IsPremium) VALUES (@ticker, @eventType, @description, @verdict, @impactScore, @isPremium)`,
      (err) => { conn.close(); if (err) reject(err); else resolve(); }
    );
    req.addParameter("ticker",      TYPES.NVarChar, data.ticker.toUpperCase());
    req.addParameter("eventType",   TYPES.NVarChar, data.eventType);
    req.addParameter("description", TYPES.NVarChar, data.description);
    req.addParameter("verdict",     TYPES.NVarChar, data.verdict);
    req.addParameter("impactScore", TYPES.Int,      Math.round(data.impactScore));
    req.addParameter("isPremium",   TYPES.Bit,      data.isPremium ? 1 : 0);
    conn.execSql(req);
  });
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    let user: UserRecord | null = null;
    const req = new Request(
      `SELECT TOP 1 id, email, password_hash, name, user_plan AS [plan], plan_status, plan_interval, stripe_customer_id, stripe_subscription_id FROM Users WHERE email = @email`,
      (err) => { conn.close(); if (err) reject(err); else resolve(user); }
    );
    req.addParameter("email", TYPES.NVarChar, email.toLowerCase().trim());
    req.on("row", (cols) => { const r: any = {}; cols.forEach((c: any) => { r[c.metadata.colName] = c.value; }); user = r; });
    conn.execSql(req);
  });
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    let user: UserRecord | null = null;
    const req = new Request(
      `SELECT TOP 1 id, email, name, user_plan AS [plan], plan_status, plan_interval, stripe_customer_id, stripe_subscription_id FROM Users WHERE id = @id`,
      (err) => { conn.close(); if (err) reject(err); else resolve(user); }
    );
    req.addParameter("id", TYPES.UniqueIdentifier, id);
    req.on("row", (cols) => { const r: any = {}; cols.forEach((c: any) => { r[c.metadata.colName] = c.value; }); user = r; });
    conn.execSql(req);
  });
}

export async function createUser(email: string, passwordHash: string, name: string): Promise<string> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    let newId = "";
    const req = new Request(
      `INSERT INTO Users (email, password_hash, name, user_plan, plan_status) OUTPUT INSERTED.id VALUES (@email, @passwordHash, @name, 'free', 'active')`,
      (err) => { conn.close(); if (err) reject(err); else resolve(newId); }
    );
    req.addParameter("email",        TYPES.NVarChar, email.toLowerCase().trim());
    req.addParameter("passwordHash", TYPES.NVarChar, passwordHash);
    req.addParameter("name",         TYPES.NVarChar, name || email.split("@")[0]);
    req.on("row", (cols) => { newId = cols[0].value; });
    conn.execSql(req);
  });
}

export async function updateUserPlan(stripeCustomerId: string, plan: string, planStatus: string, subscriptionId: string): Promise<void> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const req = new Request(
      `UPDATE Users SET user_plan = @plan, plan_status = @planStatus, stripe_subscription_id = @subId, updated_at = GETUTCDATE() WHERE stripe_customer_id = @customerId`,
      (err) => { conn.close(); if (err) reject(err); else resolve(); }
    );
    req.addParameter("plan",       TYPES.NVarChar, plan);
    req.addParameter("planStatus", TYPES.NVarChar, planStatus);
    req.addParameter("subId",      TYPES.NVarChar, subscriptionId || "");
    req.addParameter("customerId", TYPES.NVarChar, stripeCustomerId);
    conn.execSql(req);
  });
}

export async function setStripeCustomerId(userId: string, stripeCustomerId: string): Promise<void> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const req = new Request(
      `UPDATE Users SET stripe_customer_id = @customerId, updated_at = GETUTCDATE() WHERE id = @id`,
      (err) => { conn.close(); if (err) reject(err); else resolve(); }
    );
    req.addParameter("customerId", TYPES.NVarChar, stripeCustomerId);
    req.addParameter("id",         TYPES.UniqueIdentifier, userId);
    conn.execSql(req);
  });
}

export async function saveContactMessage(name: string, email: string, subject: string, message: string): Promise<void> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const req = new Request(
      `INSERT INTO ContactMessages (name, email, subject, message, created_at) VALUES (@name, @email, @subject, @message, GETUTCDATE())`,
      (err) => { conn.close(); if (err) reject(err); else resolve(); }
    );
    req.addParameter("name",    TYPES.NVarChar, name.trim());
    req.addParameter("email",   TYPES.NVarChar, email.toLowerCase().trim());
    req.addParameter("subject", TYPES.NVarChar, subject.trim());
    req.addParameter("message", TYPES.NVarChar, message.trim());
    conn.execSql(req);
  });
}

// ── Signals ────────────────────────────────────────────────────────────────
export interface Signal {
  id:           string;
  symbol:       string;
  ts:           string;        // ISO 8601 UTC
  direction:    "UP" | "DOWN";
  confidence:   number;        // 0-100
  last_price:   number;
  mean_target:  number;
  pct_change:   number;        // signed
  bull_range:   number;
  bear_range:   number;
  steps:        number;
  model:        string;
  created_at:   string;
}

export async function insertSignal(s: {
  symbol:      string;
  direction:   "UP" | "DOWN";
  confidence:  number;
  last_price:  number;
  mean_target: number;
  pct_change:  number;
  bull_range:  number;
  bear_range:  number;
  steps:       number;
  model:       string;
}): Promise<string> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    let newId = "";
    const req = new Request(
      `INSERT INTO Signals (symbol, direction, confidence, last_price, mean_target, pct_change, bull_range, bear_range, steps, model)
       OUTPUT INSERTED.id
       VALUES (@symbol, @direction, @confidence, @last_price, @mean_target, @pct_change, @bull_range, @bear_range, @steps, @model)`,
      (err) => { conn.close(); if (err) reject(err); else resolve(newId); }
    );
    req.addParameter("symbol",      TYPES.NVarChar, s.symbol.toUpperCase());
    req.addParameter("direction",   TYPES.NVarChar, s.direction);
    req.addParameter("confidence",  TYPES.Int,      Math.max(0, Math.min(100, Math.round(s.confidence))));
    req.addParameter("last_price",  TYPES.Float,    s.last_price);
    req.addParameter("mean_target", TYPES.Float,    s.mean_target);
    req.addParameter("pct_change",  TYPES.Float,    s.pct_change);
    req.addParameter("bull_range",  TYPES.Float,    s.bull_range);
    req.addParameter("bear_range",  TYPES.Float,    s.bear_range);
    req.addParameter("steps",       TYPES.Int,      s.steps);
    req.addParameter("model",       TYPES.NVarChar, s.model);
    req.on("row", (cols) => { newId = cols[0].value; });
    conn.execSql(req);
  });
}

export async function getRecentSignals(opts: { limit?: number; minConfidence?: number } = {}): Promise<Signal[]> {
  const { limit = 50, minConfidence = 0 } = opts;
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const rows: Signal[] = [];
    const req = new Request(
      `SELECT TOP (@limit) id, symbol, ts, direction, confidence, last_price, mean_target, pct_change, bull_range, bear_range, steps, model, created_at
       FROM Signals
       WHERE confidence >= @minConfidence
       ORDER BY ts DESC`,
      (err) => { conn.close(); if (err) reject(err); else resolve(rows); }
    );
    req.addParameter("limit",         TYPES.Int, Math.min(limit, 500));
    req.addParameter("minConfidence", TYPES.Int, minConfidence);
    req.on("row", (cols) => { const r: any = {}; cols.forEach((c: any) => { r[c.metadata.colName] = c.value; }); rows.push(r); });
    conn.execSql(req);
  });
}

export async function getSignalsForSymbol(symbol: string, limit = 100): Promise<Signal[]> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const rows: Signal[] = [];
    const req = new Request(
      `SELECT TOP (@limit) id, symbol, ts, direction, confidence, last_price, mean_target, pct_change, bull_range, bear_range, steps, model, created_at
       FROM Signals
       WHERE symbol = @symbol
       ORDER BY ts DESC`,
      (err) => { conn.close(); if (err) reject(err); else resolve(rows); }
    );
    req.addParameter("symbol", TYPES.NVarChar, symbol.toUpperCase());
    req.addParameter("limit",  TYPES.Int,      Math.min(limit, 1000));
    req.on("row", (cols) => { const r: any = {}; cols.forEach((c: any) => { r[c.metadata.colName] = c.value; }); rows.push(r); });
    conn.execSql(req);
  });
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  name: string | null;
  asset_type: string;
  added_at: string;
}

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const rows: WatchlistItem[] = [];
    const req = new Request(
      `SELECT id, symbol, name, asset_type, added_at FROM Watchlists WHERE user_id = @userId ORDER BY added_at DESC`,
      (err) => { conn.close(); if (err) reject(err); else resolve(rows); }
    );
    req.addParameter("userId", TYPES.UniqueIdentifier, userId);
    req.on("row", (cols) => { const r: any = {}; cols.forEach((c: any) => { r[c.metadata.colName] = c.value; }); rows.push(r); });
    conn.execSql(req);
  });
}

export async function addWatchlistItem(userId: string, symbol: string, name: string, assetType: string): Promise<void> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const req = new Request(
      `IF NOT EXISTS (SELECT 1 FROM Watchlists WHERE user_id = @userId AND symbol = @symbol)
       INSERT INTO Watchlists (user_id, symbol, name, asset_type, added_at) VALUES (@userId, @symbol, @name, @assetType, GETUTCDATE())`,
      (err) => { conn.close(); if (err) reject(err); else resolve(); }
    );
    req.addParameter("userId",    TYPES.UniqueIdentifier, userId);
    req.addParameter("symbol",    TYPES.NVarChar, symbol.toUpperCase().trim());
    req.addParameter("name",      TYPES.NVarChar, name.trim());
    req.addParameter("assetType", TYPES.NVarChar, assetType);
    conn.execSql(req);
  });
}

export async function removeWatchlistItem(userId: string, symbol: string): Promise<void> {
  const conn = await getConnection();
  return new Promise((resolve, reject) => {
    const req = new Request(
      `DELETE FROM Watchlists WHERE user_id = @userId AND symbol = @symbol`,
      (err) => { conn.close(); if (err) reject(err); else resolve(); }
    );
    req.addParameter("userId", TYPES.UniqueIdentifier, userId);
    req.addParameter("symbol", TYPES.NVarChar, symbol.toUpperCase().trim());
    conn.execSql(req);
  });
}
