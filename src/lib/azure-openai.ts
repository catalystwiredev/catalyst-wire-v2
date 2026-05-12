import { AzureOpenAI } from "openai";
import { getSecret } from "./azure-secrets";

let openaiClient: AzureOpenAI | null = null;

async function getClient(): Promise<AzureOpenAI> {
  if (openaiClient) return openaiClient;

  const endpoint = await getSecret("AZURE-OPENAI-ENDPOINT");
  const apiKey = await getSecret("AZURE-OPENAI-API-KEY");

  openaiClient = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion: "2024-08-01-preview",
  });

  return openaiClient;
}

export interface CatalystScore {
  ticker: string;
  verdict: "Bullish" | "Bearish" | "Neutral";
  impactScore: number; // 0–100
  summary: string;
  conviction: "A" | "B" | "C" | "D";
  catalystType: string;
}

const SYSTEM_PROMPT = `You are a quantitative trading analyst specializing in catalyst identification.
Given a financial event (SEC filing, news, earnings, FDA decision, etc.), score it as a trading catalyst.
Respond ONLY with valid JSON matching this schema:
{
  "verdict": "Bullish" | "Bearish" | "Neutral",
  "impactScore": <integer 0-100>,
  "summary": "<1-2 sentence analysis>",
  "conviction": "A" | "B" | "C" | "D",
  "catalystType": "<e.g. Earnings Beat, Insider Buy, FDA Approval, 8-K Material Event, Form 4>"
}
Rules:
- impactScore 80-100 = tier A conviction, major directional catalyst
- impactScore 60-79 = tier B, clear signal
- impactScore 40-59 = tier C, moderate signal
- impactScore 0-39 = tier D, weak or ambiguous
- Be objective, data-driven. No disclaimers.`;

export async function scoreCatalyst(opts: {
  ticker: string;
  description: string;
  formType?: string;
  price?: number;
}): Promise<CatalystScore> {
  const client = await getClient();
  const model = (await getSecret("AZURE-OPENAI-DEPLOYMENT")) ?? "gpt-4o";

  const content = `Ticker: ${opts.ticker}
Form/Type: ${opts.formType ?? "News"}
${opts.price ? `Current Price: $${opts.price}` : ""}
Event: ${opts.description}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content },
    ],
    temperature: 0.1,
    max_tokens: 300,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);

  return {
    ticker: opts.ticker,
    verdict: parsed.verdict ?? "Neutral",
    impactScore: Math.min(100, Math.max(0, parseInt(parsed.impactScore ?? 50))),
    summary: parsed.summary ?? "",
    conviction: parsed.conviction ?? "C",
    catalystType: parsed.catalystType ?? opts.formType ?? "Event",
  };
}

export async function scoreNewsBatch(articles: { id: string; headline: string; ticker?: string }[]): Promise<Record<string, number>> {
  const client = await getClient();
  const model = (await getSecret("AZURE-OPENAI-DEPLOYMENT")) ?? "gpt-4o";

  const prompt = articles.slice(0, 10).map((a, i) =>
    `${i + 1}. [${a.ticker ?? "MKT"}] ${a.headline}`
  ).join("\n");

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: `Score each headline's market impact 0-100. Return JSON: { "scores": [<int>, ...] } in same order.` },
      { role: "user", content: prompt },
    ],
    temperature: 0,
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  const raw = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw);
  const scores: number[] = parsed.scores ?? [];

  return Object.fromEntries(articles.map((a, i) => [a.id, scores[i] ?? 50]));
}
