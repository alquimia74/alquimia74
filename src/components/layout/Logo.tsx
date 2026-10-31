"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  className?: string;
  height?: number;
  light?: boolean;
}

export function Logo({
  className = "",
  height = 36,
  light = false,
}: LogoProps) {
  const [err, setErr] = useState(false);
  const displayHeight = height * 1.5;

  if (err) {
    return (
      <span
        className={`inline-flex items-center font-black tracking-tight ${className}`}
        style={{ fontSize: `${displayHeight * 0.62}px`, lineHeight: 1 }}
      >
        <span className="text-brand">yeti</span>
        <span className="text-accent">ş</span>
        <span className={light ? "text-white" : "text-navy"}>ikayet.com</span>
      </span>
    );
  }

  return (
    <Image
      src="/brand/logo.svg"
      alt="yetişikayet.com"
      width={0}
      height={0}
      unoptimized
      className={`${light ? "brightness-0 invert" : ""} ${className}`}
      style={{ width: "auto", height: displayHeight }}
      onError={() => setErr(true)}
      priority
    />
  );
}
