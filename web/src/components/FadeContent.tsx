"use client";

import { useRef, useEffect, type ReactNode } from "react";

interface FadeContentProps {
  children: ReactNode;
  blur?: boolean;
  duration?: number;
  ease?: string;
  delay?: number;
  threshold?: number;
  initialOpacity?: number;
  className?: string;
}

export default function FadeContent({
  children,
  blur = false,
  duration = 1000,
  ease = "power2.out",
  delay = 0,
  threshold = 0.1,
  initialOpacity = 0,
  className = "",
}: FadeContentProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const getSeconds = (val: number) => (val > 10 ? val / 1000 : val);

    el.style.opacity = String(initialOpacity);
    el.style.visibility = "visible";
    el.style.transition = "none";

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              el.style.transition = `opacity ${getSeconds(duration)}s ${ease}, filter ${getSeconds(duration)}s ${ease}`;
              el.style.opacity = "1";
              el.style.filter = "blur(0px)";
              observer.unobserve(el);
            }
          });
        },
        { threshold }
      );

      if (blur) {
        el.style.filter = "blur(10px)";
      }

      observer.observe(el);

      return () => {
        observer.disconnect();
      };
    }, getSeconds(delay) * 1000);

    return () => clearTimeout(timer);
  }, [blur, duration, ease, delay, threshold, initialOpacity]);

  return (
    <div ref={ref} className={className} style={{ visibility: "hidden" }}>
      {children}
    </div>
  );
}
