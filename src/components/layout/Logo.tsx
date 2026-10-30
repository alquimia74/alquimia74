"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  className?: string;
  height?: number;
  light?: boolean;
}

export function Logo({ className = "", height = 36, light = false }: LogoProps) {
  const [err, setErr] = useState(false);

  if (err) {
    return (
      <span
        className={`inline-flex items-center font-black tracking-tight ${className}`}
        style={{ fontSize: `${height * 0.62}px`, lineHeight: 1 }}
      >
        <span className="text-brand">yetiş</span>
        <span className="text-accent">+</span>
        <span className={light ? "text-white" : "text-navy"}>var</span>
      </span>
    );
  }

  return (
    <Image
      src="/brand/logo.png"
      alt="YetişVar"
      width={0}
      height={0}
      unoptimized
      className={`${light ? "brightness-0 invert" : ""} ${className}`}
      style={{ width: "auto", height }}
      onError={() => setErr(true)}
      priority
    />
  );
}
