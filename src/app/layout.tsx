import { Suspense } from "react";
import { SiteShell } from "@/components/layout/SiteShell";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MusicPlayer } from "@/components/layout/MusicPlayer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { generateMeta } from "@/lib/seo";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = generateMeta({
  title: "yetişikayet.com | Yetiş+ Çarşı Çalışan Şikâyetleri",
  description:
    "Hızır Global A.Ş. bünyesindeki Yetiş+ Çarşı hakkında çalışan şikâyetlerini bir araya getiren bağımsız arşiv.",
  path: "/",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#00A383",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <Suspense
          fallback={
            <main
              className="grid min-h-screen place-items-center text-sm text-muted"
              aria-busy="true"
            >
              Yükleniyor…
            </main>
          }
        >
          <SiteShell
            header={<Header />}
            footer={<Footer />}
            tabs={<MobileTabBar />}
            music={<MusicPlayer />}
          >
            {children}
          </SiteShell>
        </Suspense>
      </body>
    </html>
  );
}
