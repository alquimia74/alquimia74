/**
 * YetişVar — Merkezi Konfigürasyon
 *
 * PUBLIC_INDEXING_ENABLED = false olduğu sürece tüm site noindex olarak işaretlenir.
 * Gerçek domain ve içerik yayınlanınca bu değeri true yapın.
 */
export const config = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  siteName: 'YetişVar',
  siteSlogan: "Yetiş'e dair anlatacaklar var.",
  publicIndexingEnabled: process.env.PUBLIC_INDEXING_ENABLED === 'true',
  defaultOgImage: '/og-image.png',
} as const;
