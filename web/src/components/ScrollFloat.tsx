"use client";

import { useEffect, useMemo, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollFloatProps {
  children: string;
  className?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span";
}

export default function ScrollFloat({
  children,
  className = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
  as: Tag = "h2",
}: ScrollFloatProps) {
  const containerRef = useRef<any>(null);

  const splitText = useMemo(() => {
    return children.split("").map((char, index) => (
      <span className="sf-char" key={index}>
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const charElements = el.querySelectorAll(".sf-char");

    const anim = gsap.fromTo(
      charElements,
      {
        willChange: "opacity, transform",
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: "50% 0%",
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      }
    );

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <Tag ref={containerRef} className={`scroll-float ${className}`}>
      <span className={`scroll-float-text ${textClassName}`}>{splitText}</span>
    </Tag>
  );
}
