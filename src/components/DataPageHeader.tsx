import { Crown, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string | number;
  color?: string;
}

interface DataPageHeaderProps {
  label:        string;
  labelColor:   string;
  icon:         LucideIcon;
  iconColor:    string;
  iconGlow:     string;
  title:        string;
  description:  string;
  stats?:       Stat[];
  isPremium:    boolean;
  upgradeHref:  string;
  upgradeLabel: string;
  premiumLabel?: string;
}

export function DataPageHeader({
  label,
  labelColor,
  icon: Icon,
  iconColor,
  iconGlow,
  title,
  description,
  stats,
  isPremium,
  upgradeHref,
  upgradeLabel,
  premiumLabel = "Full Access Active",
}: DataPageHeaderProps) {
  return (
    <div style={{
      position:         "relative",
      background:       "rgba(6,11,22,0.80)",
      backdropFilter:   "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      border:           "1px solid rgba(255,255,255,0.07)",
      borderRadius:     22,
      padding:          "30px 32px 28px",
      marginBottom:     28,
      overflow:         "hidden",
    }}>
      {/* Ambient glow orb — top-right */}
      <div style={{
        position:     "absolute",
        top:          -80,
        right:        -60,
        width:        320,
        height:       320,
        background:   `radial-gradient(circle, ${iconGlow} 0%, transparent 70%)`,
        pointerEvents:"none",
        filter:       "blur(50px)",
        opacity:      0.7,
      }}/>
      {/* Second subtle orb — bottom-left */}
      <div style={{
        position:     "absolute",
        bottom:       -60,
        left:         -40,
        width:        220,
        height:       220,
        background:   `radial-gradient(circle, ${iconGlow} 0%, transparent 70%)`,
        pointerEvents:"none",
        filter:       "blur(40px)",
        opacity:      0.35,
      }}/>
      {/* Shimmer line */}
      <div style={{
        position:   "absolute",
        top:        0,
        left:       "8%",
        right:      "8%",
        height:     1,
        background: `linear-gradient(90deg, transparent, ${iconColor}70, transparent)`,
      }}/>
      {/* Bottom fade line */}
      <div style={{
        position:   "absolute",
        bottom:     0,
        left:       "20%",
        right:      "20%",
        height:     1,
        background: `linear-gradient(90deg, transparent, ${iconColor}25, transparent)`,
      }}/>

      <div style={{
        position:      "relative",
        display:       "flex",
        alignItems:    "flex-start",
        justifyContent:"space-between",
        flexWrap:      "wrap",
        gap:           20,
      }}>
        {/* Left: title block */}
        <div style={{ flex: 1, minWidth: 240 }}>
          {/* Live label */}
          <div style={{
            display:       "inline-flex",
            alignItems:    "center",
            gap:           7,
            background:    `${iconColor}12`,
            border:        `1px solid ${iconColor}28`,
            borderRadius:  20,
            padding:       "4px 12px 4px 8px",
            marginBottom:  16,
          }}>
            <span style={{
              display:    "inline-block",
              width:       6,
              height:      6,
              borderRadius:"50%",
              background:  labelColor,
              boxShadow:   `0 0 8px ${labelColor}, 0 0 16px ${labelColor}50`,
              animation:   "live-fade 2s ease-in-out infinite",
            }}/>
            <span style={{
              fontSize:       10,
              fontWeight:     700,
              letterSpacing: "0.14em",
              color:          labelColor,
              textTransform: "uppercase",
            }}>{label}</span>
          </div>

          {/* Icon + Title row */}
          <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:10 }}>
            <div style={{
              width:           52,
              height:          52,
              background:      `linear-gradient(135deg, ${iconColor}18, ${iconColor}06)`,
              border:          `1px solid ${iconColor}35`,
              borderRadius:    14,
              display:         "flex",
              alignItems:      "center",
              justifyContent:  "center",
              boxShadow:       `0 0 24px ${iconGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
              flexShrink:      0,
              position:        "relative",
            }}>
              <Icon size={24} style={{ color: iconColor, filter: `drop-shadow(0 0 6px ${iconColor})` }}/>
            </div>
            <h1 style={{
              fontSize:      "clamp(24px,3.5vw,38px)",
              fontWeight:    800,
              letterSpacing: "-0.03em",
              margin:        0,
              lineHeight:    1.1,
              background:    `linear-gradient(135deg, #fff 0%, ${iconColor}cc 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>{title}</h1>
          </div>

          <p style={{
            fontSize:  14.5,
            color:     "var(--text-secondary)",
            lineHeight: 1.65,
            maxWidth:   600,
            margin:     0,
          }}>{description}</p>

          {/* Stats badges */}
          {stats && stats.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:18 }}>
              {stats.map(s => (
                <div key={s.label} style={{
                  background:   "rgba(255,255,255,0.04)",
                  border:       "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 10,
                  padding:      "8px 14px",
                  display:      "flex",
                  flexDirection:"column",
                  gap:          3,
                  backdropFilter: "blur(8px)",
                }}>
                  <span style={{
                    fontSize:   18,
                    fontWeight: 800,
                    fontFamily: "monospace",
                    color:      s.color ?? iconColor,
                    letterSpacing: "-0.02em",
                    textShadow: `0 0 12px ${s.color ?? iconGlow}`,
                  }}>{s.value}</span>
                  <span style={{
                    fontSize:      10,
                    color:         "var(--text-muted)",
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    fontWeight:    600,
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: CTA */}
        <div style={{ flexShrink: 0, alignSelf: "flex-start" }}>
          {isPremium ? (
            <div style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           8,
              background:    "rgba(0,230,118,0.10)",
              border:        "1px solid rgba(0,230,118,0.30)",
              color:         "var(--bull)",
              padding:       "12px 22px",
              borderRadius:  12,
              fontSize:      13,
              fontWeight:    700,
              whiteSpace:    "nowrap",
              boxShadow:     "0 0 20px rgba(0,230,118,0.15)",
            }}>
              <Crown size={14}/> {premiumLabel}
            </div>
          ) : (
            <Link href={upgradeHref} style={{
              display:        "inline-flex",
              alignItems:     "center",
              gap:            8,
              background:     `linear-gradient(135deg, ${iconColor} 0%, ${iconColor}bb 100%)`,
              color:          "#fff",
              padding:        "12px 22px",
              borderRadius:   12,
              fontSize:       13,
              fontWeight:     700,
              textDecoration: "none",
              boxShadow:      `0 0 28px ${iconGlow}, 0 4px 16px rgba(0,0,0,0.4)`,
              whiteSpace:     "nowrap",
              letterSpacing:  "0.01em",
            }}>
              {upgradeLabel} <ArrowRight size={14}/>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
