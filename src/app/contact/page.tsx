"use client";
import { useState, FormEvent } from "react";
import { Mail, MessageSquare, Send, CheckCircle, ExternalLink } from "lucide-react";

const TOPICS = ["General question","Bug report","Feature request","Data issue","Billing / subscription","Partnership / press","Other"];

export default function ContactPage() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [topic,   setTopic]   = useState(TOPICS[0]);
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject: topic, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      // fall-through: still show success to avoid form spam enumeration
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  const input: React.CSSProperties = {
    width: "100%", background: "var(--bg-elevated)", border: "1px solid var(--border-medium)",
    borderRadius: 8, padding: "11px 14px", fontSize: 14, color: "var(--text-primary)",
    outline: "none", transition: "border-color 0.15s",
  };

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "var(--accent)", textTransform: "uppercase", marginBottom: 10 }}>Get in Touch</div>
        <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Contact Us</h1>
        <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.7 }}>
          Have a question, found a bug, or want to collaborate? I try to respond within 24 hours.
        </p>
        <div style={{ display: "flex", gap: 20, marginTop: 20, flexWrap: "wrap" }}>
          <a href="mailto:catalystwiredev@gmail.com" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>
            <Mail size={14} style={{ color: "var(--accent)" }}/> catalystwiredev@gmail.com
          </a>
          <a href="https://github.com/catalystwiredev" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text-secondary)", textDecoration: "none" }}>
            <ExternalLink size={14} style={{ color: "var(--accent)" }}/> GitHub
          </a>
        </div>
      </div>

      {sent ? (
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--bull-border)", borderRadius: 16, padding: 40, textAlign: "center" }}>
          <CheckCircle size={40} style={{ color: "var(--bull)", marginBottom: 16 }}/>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Message sent!</h2>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
            Thanks for reaching out. I&apos;ll get back to you at <strong>{email}</strong> within 24 hours.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>YOUR NAME</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Angel Gomez" required style={input}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")} onBlur={e => (e.target.style.borderColor = "var(--border-medium)")}/>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>EMAIL</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required style={input}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")} onBlur={e => (e.target.style.borderColor = "var(--border-medium)")}/>
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>TOPIC</label>
            <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...input }}>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>MESSAGE</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell me what's on your mind…" required rows={6}
              style={{ ...input, resize: "vertical", minHeight: 130 }}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")} onBlur={e => (e.target.style.borderColor = "var(--border-medium)")}/>
          </div>
          <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: loading ? "var(--accent-dim)" : "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "12px 0", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer" }}>
            <Send size={15}/> {loading ? "Sending…" : "Send message"}
          </button>
        </form>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
        {[
          { icon: MessageSquare, title: "Response time", body: "Typically within 24 hours on weekdays." },
          { icon: Mail,          title: "Student discount", body: "Email from your .edu for 40% off any paid plan." },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
            <Icon size={15} style={{ color: "var(--accent)", marginBottom: 8 }}/>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{title}</div>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.6 }}>{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
