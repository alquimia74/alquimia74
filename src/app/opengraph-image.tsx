import { ImageResponse } from "next/og";
import { config } from "@/lib/config";
export const alt = "yetişikayet.com — Yetiş+ Çarşı çalışan şikâyetleri";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#10224A",
        color: "white",
        padding: "70px 80px",
        justifyContent: "space-between",
        borderTop: "16px solid #00A383",
      }}
    >
      <div
        style={{
          display: "flex",
          color: "#FFB90C",
          fontSize: 46,
          fontWeight: 700,
        }}
      >
        {config.siteName}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 68,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        <span>Yaşananlar,</span>
        <span style={{ color: "#FFB90C" }}>belgeleriyle.</span>
      </div>
      <div style={{ display: "flex", fontSize: 29, color: "#D6E8E3" }}>
        Yetiş+ Çarşı çalışan şikâyetleri için bağımsız arşiv
      </div>
    </div>,
    size,
  );
}
