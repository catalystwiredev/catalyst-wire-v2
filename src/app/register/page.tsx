"use client";
import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle, Zap } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const pwStrength = password.length === 0 ? 0 
    : password.length < 6 ? 1 
    : password.length < 10 ? 2 
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3;
  
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];
  const strengthColor = ["", "var(--bear)", "var(--neutral)", "var(--accent)", "var(--bull)"][pwStrength];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Registration failed.");
        setLoading(false);
        return;
      }

      // Auto-login after successful registration
      const loginRes = await signIn("credentials", { 
        email, 
        password, 
        redirect: false 
      });

      if (loginRes?.error) {
        router.push("/login");
      } else {
        router.push("/register/success");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const input: React.CSSProperties = {
    width: "100%", 
    background: "var(--bg-elevated)", 
    border: "1px solid var(--border-medium)",
    borderRadius: 8, 
    padding: "11px 14px", 
    fontSize: 14, 
    color: "var(--text-primary)",
    outline: "none", 
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ minHeight: "calc(100vh - var(--tape-h))", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, background: "var(--accent-dim)", border: "1px solid var(--accent-glow)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} style={{ color: "var(--accent)" }}/>
            </div>
            <span style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 20, letterSpacing: "-0.02em" }}>
              catalyst<span style={{ color: "var(--accent)" }}>wire</span>
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Free forever. Upgrade when you're ready.</p>
        </div>

        {/* Perks strip */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 24, flexWrap: "wrap" }}>
          {["7-day free trial", "No credit card", "Cancel anytime"].map(perk => (
            <span key={perk} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--bull)", fontWeight: 500 }}>
              <CheckCircle size={12}/> {perk}
            </span>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ background: "var(--bg-card)", border: "1px solid var(--border-medium)", borderRadius: 16, padding: 28 }}>
          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--bear-dim)", border: "1px solid var(--bear-border)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: "var(--bear)" }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }}/> {error}
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>FULL NAME</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Angel Gomez" 
              required 
              autoComplete="name" 
              style={input}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")} 
              onBlur={e => (e.target.style.borderColor = "var(--border-medium)")}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>EMAIL ADDRESS</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="you@example.com" 
              required 
              autoComplete="email" 
              style={input}
              onFocus={e => (e.target.style.borderColor = "var(--accent)")} 
              onBlur={e => (e.target.style.borderColor = "var(--border-medium)")}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.04em" }}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input 
                type={showPw ? "text" : "password"} 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Min. 8 characters" 
                required 
                autoComplete="new-password" 
                style={{ ...input, paddingRight: 44 }}
                onFocus={e => (e.target.style.borderColor = "var(--accent)")} 
                onBlur={e => (e.target.style.borderColor = "var(--border-medium)")}
              />
              <button 
                type="button" 
                onClick={() => setShowPw(s => !s)} 
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex" }}
              >
                {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
              </button>
            </div>

            {password.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1,2,3,4].map(n => (
                    <div 
                      key={n} 
                      style={{ 
                        flex: 1, 
                        height: 3, 
                        borderRadius: 2, 
                        background: n <= pwStrength ? strengthColor : "var(--border-medium)", 
                        transition: "background 0.2s" 
                      }} 
                    />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: strengthColor, marginTop: 4, display: "block" }}>{strengthLabel}</span>
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: "100%", 
              background: loading ? "var(--accent-dim)" : "var(--accent)", 
              color: "#fff", 
              border: "none", 
              borderRadius: 8, 
              padding: "12px 0", 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: loading ? "not-allowed" : "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 8, 
              transition: "background 0.15s" 
            }}
          >
            <UserPlus size={15}/> {loading ? "Creating account…" : "Create free account"}
          </button>

          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", marginTop: 16, lineHeight: 1.6 }}>
            By signing up you agree to our{" "}
            <Link href="/terms" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>Terms</Link> and{" "}
            <Link href="/privacy" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>Privacy Policy</Link>.
          </p>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
