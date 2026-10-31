import type { NextConfig } from "next";
const production = process.env.NODE_ENV === "production";
// Next's prerendered inline bootstrap requires unsafe-inline here. This is
// source restriction, not a nonce-based strict XSS policy; see SECURITY.md.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'" + (production ? "" : " 'unsafe-eval'"),
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'" +
    (production ? "" : " ws://localhost:* ws://127.0.0.1:*"),
  "frame-src https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(production ? ["upgrade-insecure-requests"] : []),
].join("; ");
const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Isolated production verification must not overwrite the running dev server.
  distDir:
    process.env.SECURITY_BUILD === "1" ? ".next-security-check" : ".next",
  cacheComponents: true,
  partialPrefetching: true,
  images: { remotePatterns: [], dangerouslyAllowSVG: false },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=(), autoplay=(self "https://www.youtube-nocookie.com")',
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
          ...(production
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }]
            : []),
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      {
        source: "/documents/:path*",
        headers: [
          { key: "Content-Disposition", value: "attachment" },
          { key: "X-Robots-Tag", value: "noindex, nosnippet" },
          { key: "Cache-Control", value: "private, no-store" },
        ],
      },
    ];
  },
  turbopack: {
    rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } },
  },
};
export default nextConfig;
