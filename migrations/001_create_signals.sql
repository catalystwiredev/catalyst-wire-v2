-- Migration 001: Create Signals table
-- Stores AI-generated momentum signals from the Catalyst Harvester (Chronos / Kronos / future models)
-- Each row is one model's prediction for one symbol at one point in time.

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'Signals')
BEGIN
    CREATE TABLE Signals (
        id           UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() PRIMARY KEY,
        symbol       NVARCHAR(20)     NOT NULL,
        ts           DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME(),
        direction    NVARCHAR(8)      NOT NULL,                          -- 'UP' | 'DOWN'
        confidence   INT              NOT NULL,                          -- 0-100, % of median preds beating last_price
        last_price   FLOAT            NOT NULL,                          -- price at signal generation
        mean_target  FLOAT            NOT NULL,                          -- median predicted price (q50 mean)
        pct_change   FLOAT            NOT NULL,                          -- signed expected % move
        bull_range   FLOAT            NOT NULL,                          -- q90 mean (optimistic ceiling)
        bear_range   FLOAT            NOT NULL,                          -- q10 mean (pessimistic floor)
        steps        INT              NOT NULL,                          -- number of forecast steps
        model        NVARCHAR(64)     NOT NULL,                          -- 'chronos-bolt-small' | 'kronos-base' | etc.
        created_at   DATETIME2(0)     NOT NULL DEFAULT SYSUTCDATETIME()
    );

    -- Symbol lookup: most recent signals per symbol (chart pages)
    CREATE INDEX IX_Signals_Symbol_TS ON Signals (symbol, ts DESC);

    -- Global feed: most recent signals across all symbols (/signals page)
    CREATE INDEX IX_Signals_TS ON Signals (ts DESC);

    -- High-confidence filter (e.g., only show >= 70% confidence)
    CREATE INDEX IX_Signals_Confidence_TS ON Signals (confidence DESC, ts DESC);
END
GO
