"use client";
import { useEffect } from "react";

export default function GlobalError({ 
  error, 
  reset 
}: { 
  error: Error & { digest?: string }; 
  reset: () => void 
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      gap: 24, 
      padding: 32, 
      textAlign: "center",
      background: "var(--bg-base)"
    }}>
      <div style={{ 
        width: 64, 
        height: 64, 
        borderRadius: "50%", 
        background: "var(--bear)18", 
        border: "1px solid var(--bear)40", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        fontSize: 28 
      }}>
        ⚠
      </div>

      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 400 }}>
          An unexpected error occurred. Our team has been notified.
          {error.digest && <span style={{ display: "block", marginTop: 6, fontSize: 11, fontFamily: "monospace", color: "var(--text-muted)" }}>Error ID: {error.digest}</span>}
        </p>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <button 
          onClick={reset} 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 6, 
            background: "var(--accent)", 
            color: "#fff", 
            padding: "10px 20px", 
            borderRadius: 8, 
            fontSize: 13, 
            fontWeight: 600, 
            border: "none", 
            cursor: "pointer" 
          }}
        >
          Try again
        </button>
        <a 
          href="/dashboard" 
          style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: 6, 
            background: "var(--bg-elevated)", 
            border: "1px solid var(--border)", 
            color: "var(--text-primary)", 
            padding: "10px 20px", 
            borderRadius: 8, 
            fontSize: 13, 
            fontWeight: 600, 
            textDecoration: "none" 
          }}
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
