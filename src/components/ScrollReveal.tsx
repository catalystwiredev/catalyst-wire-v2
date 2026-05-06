"use client";
import { useEffect, useRef, ReactNode } from "react";

interface Props {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right" | "scale";
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className,
  style,
  threshold = 0.08,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const initial: Record<string, string> = {
    up:    "opacity:0;transform:translateY(32px)",
    left:  "opacity:0;transform:translateX(-32px)",
    right: "opacity:0;transform:translateX(32px)",
    scale: "opacity:0;transform:scale(0.92)",
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "none";
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const [opacityStr, transformStr] = initial[direction].split(";");
  const initOpacity = opacityStr.split(":")[1];
  const initTransform = transformStr.split(":")[1];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: Number(initOpacity),
        transform: initTransform,
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        willChange: "opacity, transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Stagger a group of children with sequential delays */
export function ScrollRevealGroup({
  children,
  baseDelay = 0,
  stagger = 80,
  direction = "up",
  className,
  style,
}: {
  children: ReactNode[];
  baseDelay?: number;
  stagger?: number;
  direction?: Props["direction"];
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      {(children as ReactNode[]).map((child, i) => (
        <ScrollReveal key={i} delay={baseDelay + i * stagger} direction={direction} className={className} style={style}>
          {child}
        </ScrollReveal>
      ))}
    </>
  );
}
