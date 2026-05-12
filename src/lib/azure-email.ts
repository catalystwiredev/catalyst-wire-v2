import { EmailClient, KnownEmailSendStatus } from "@azure/communication-email";
import { getSecret } from "./azure-secrets";

let emailClient: EmailClient | null = null;

async function getClient(): Promise<EmailClient> {
  if (emailClient) return emailClient;

  const connString = await getSecret("AZURE-COMMUNICATION-CONNECTION-STRING");
  emailClient = new EmailClient(connString);
  return emailClient;
}

const SITE = process.env.NEXTAUTH_URL ?? "https://catalyst-wire.azurewebsites.net";

export async function sendContactNotification(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const client = await getClient();
  const from = (await getSecret("AZURE-EMAIL-FROM")) ?? "noreply@catalystwire.com";

  const poller = await client.beginSend({
    senderAddress: from,
    recipients: {
      to: [{ address: "catalystwiredev@gmail.com", displayName: "Catalyst Wire" }],
    },
    replyTo: [{ address: opts.email, displayName: opts.name }],
    content: {
      subject: `[Contact] ${opts.subject} — from ${opts.name}`,
      plainText: `Name: ${opts.name}\nEmail: ${opts.email}\n\n${opts.message}`,
      html: `
        <div style="font-family:monospace;background:#050810;color:#e0e0e0;padding:24px;border-radius:8px;max-width:600px">
          <div style="color:#0099ff;font-size:11px;letter-spacing:0.1em;margin-bottom:16px">CATALYST WIRE — CONTACT FORM</div>
          <table style="width:100%;border-collapse:collapse;margin-bottom:16px">
            <tr><td style="padding:6px 0;color:#888;width:80px">From</td><td style="padding:6px 0">${opts.name}</td></tr>
            <tr><td style="padding:6px 0;color:#888">Email</td><td style="padding:6px 0"><a href="mailto:${opts.email}" style="color:#0099ff">${opts.email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#888">Subject</td><td style="padding:6px 0">${opts.subject}</td></tr>
          </table>
          <div style="border-top:1px solid #1a2035;padding-top:16px;line-height:1.6;white-space:pre-wrap">${opts.message}</div>
        </div>`,
    },
  });

  const result = await poller.pollUntilDone();
  if (result.status === KnownEmailSendStatus.Failed) {
    throw new Error(`Email failed: ${result.error?.message}`);
  }
}

export async function sendWelcomeEmail(opts: {
  name: string;
  email: string;
  plan: string;
}): Promise<void> {
  const client = await getClient();
  const from = (await getSecret("AZURE-EMAIL-FROM")) ?? "noreply@catalystwire.com";

  await client.beginSend({
    senderAddress: from,
    recipients: { to: [{ address: opts.email, displayName: opts.name }] },
    content: {
      subject: "Welcome to Catalyst Wire",
      plainText: `Hi ${opts.name},\n\nYour account is ready. Sign in at ${SITE}/login\n\nPlan: ${opts.plan}\n\n— Catalyst Wire`,
      html: `
        <div style="font-family:monospace;background:#050810;color:#e0e0e0;padding:32px;border-radius:8px;max-width:580px">
          <div style="font-size:18px;font-weight:700;margin-bottom:8px">catalyst<span style="color:#0099ff">wire</span></div>
          <div style="font-size:10px;letter-spacing:0.12em;color:#666;margin-bottom:24px">INTELLIGENCE PLATFORM</div>
          <h2 style="font-size:20px;font-weight:700;margin-bottom:12px">Welcome, ${opts.name}</h2>
          <p style="color:#aaa;margin-bottom:24px;line-height:1.6">Your account is live on the <strong style="color:#e0e0e0">${opts.plan}</strong> plan. Start tracking catalysts across all instruments.</p>
          <a href="${SITE}/dashboard" style="display:inline-block;background:#0099ff;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Open Dashboard →</a>
          <div style="margin-top:32px;padding-top:20px;border-top:1px solid #1a2035;font-size:11px;color:#555">
            You're receiving this because you signed up at catalystwire.com
          </div>
        </div>`,
    },
  });
}

export async function sendCatalystAlert(opts: {
  email: string;
  ticker: string;
  verdict: string;
  score: number;
  summary: string;
}): Promise<void> {
  const client = await getClient();
  const from = (await getSecret("AZURE-EMAIL-FROM")) ?? "noreply@catalystwire.com";

  const color = opts.verdict === "Bullish" ? "#00e676" : opts.verdict === "Bearish" ? "#ff3d57" : "#888";

  await client.beginSend({
    senderAddress: from,
    recipients: { to: [{ address: opts.email }] },
    content: {
      subject: `[${opts.verdict.toUpperCase()}] $${opts.ticker} — Score ${opts.score}/100`,
      plainText: `$${opts.ticker} catalyst alert\nVerdict: ${opts.verdict}\nScore: ${opts.score}/100\n\n${opts.summary}\n\nView on Catalyst Wire: ${SITE}/live-catalysts`,
      html: `
        <div style="font-family:monospace;background:#050810;color:#e0e0e0;padding:24px;border-radius:8px;max-width:560px">
          <div style="font-size:10px;letter-spacing:0.1em;color:#0099ff;margin-bottom:12px">CATALYST ALERT</div>
          <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
            <div style="font-size:24px;font-weight:700;color:#0099ff">$${opts.ticker}</div>
            <div style="background:${color}18;border:1px solid ${color}40;color:${color};padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700">${opts.verdict.toUpperCase()}</div>
            <div style="margin-left:auto;font-size:28px;font-weight:700;color:${color}">${opts.score}</div>
          </div>
          <p style="color:#aaa;line-height:1.6;margin-bottom:20px">${opts.summary}</p>
          <a href="${SITE}/live-catalysts" style="background:#0099ff;color:#fff;padding:9px 20px;border-radius:7px;text-decoration:none;font-weight:600;font-size:13px">View Catalyst →</a>
        </div>`,
    },
  });
}
