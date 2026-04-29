"use client";

import { useEffect, useRef, useState } from "react";

/**
 * DrawTitle — displays a heading where an animated underline "draws" under it
 * when it enters the viewport. The text itself fades + slides up.
 */
export function DrawTitle({
  children,
  tag: Tag = "h2",
  className = "",
  accentColor = "#0284C7",
}: {
  children: React.ReactNode;
  tag?: "h1" | "h2" | "h3";
  className?: string;
  accentColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`draw-title-wrap ${className}`}>
      <Tag
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s cubic-bezier(.22,1,.36,1), transform 0.6s cubic-bezier(.22,1,.36,1)",
          display: "block",
          position: "relative",
        }}
      >
        {children}
      </Tag>
      {/* Animated underline SVG */}
      <svg
        viewBox="0 0 300 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        style={{
          width: "100%",
          maxWidth: "340px",
          height: "10px",
          display: "block",
          marginTop: "0.5rem",
          overflow: "visible",
        }}
      >
        <path
          d="M4 6 C50 2, 150 10, 296 5"
          fill="none"
          stroke={accentColor}
          strokeWidth="3"
          strokeLinecap="round"
          style={{
            strokeDasharray: 300,
            strokeDashoffset: visible ? 0 : 300,
            transition: visible
              ? "stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1) 0.2s"
              : "none",
          }}
        />
      </svg>
    </div>
  );
}

/**
 * TypewriterText — types out text one character at a time when visible.
 */
export function TypewriterText({
  text,
  speed = 40,
  className = "",
  startDelay = 0,
}: {
  text: string;
  speed?: number;
  className?: string;
  startDelay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const timer = window.setTimeout(() => setDisplayed(text), 0);
      return () => window.clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timer);
  }, [started, text, speed, startDelay]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {started && displayed.length < text.length && (
        <span className="typewriter-cursor" aria-hidden="true">|</span>
      )}
    </span>
  );
}
