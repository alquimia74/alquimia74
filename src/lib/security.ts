/** Reject executable, credentialed and off-origin document URLs. Public files
 * must be reviewed/redacted separately; a safe URL does not certify a file. */
export function safeDocumentUrl(value: string, siteUrl: string): string | null {
  if (!value || /[\\\u0000-\u0020\u007f]/.test(value)) return null;
  try {
    const base = new URL(siteUrl);
    const url = new URL(value, base);
    const pathname = decodeURIComponent(url.pathname);
    if (
      url.protocol !== "https:" ||
      url.origin !== base.origin ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      return null;
    if (!/^\/documents\/[a-zA-Z0-9/_-]+\.(pdf|png|jpe?g|webp)$/i.test(pathname))
      return null;
    return url.href;
  } catch {
    return null;
  }
}
export function cleanFilename(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "")
    .slice(0, 180);
}
export const evidenceLimits = {
  count: 10,
  fileBytes: 10 * 1024 * 1024,
  totalBytes: 25 * 1024 * 1024,
};
export async function checkEvidenceFile(
  file: File,
  existing: File[],
): Promise<string | null> {
  if (!file.size) return "Boş dosya seçilemez.";
  if (existing.length >= evidenceLimits.count)
    return "En fazla 10 belge seçebilirsin.";
  if (file.size > evidenceLimits.fileBytes)
    return "Bir dosya en fazla 10 MB olabilir.";
  if (
    existing.reduce((total, f) => total + f.size, file.size) >
    evidenceLimits.totalBytes
  )
    return "Belgelerin toplamı en fazla 25 MB olabilir.";
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const starts = (signature: number[]) =>
    signature.every((n, i) => bytes[i] === n);
  const valid =
    (file.type === "image/png" &&
      /\.png$/i.test(file.name) &&
      starts([137, 80, 78, 71, 13, 10, 26, 10])) ||
    (file.type === "image/jpeg" &&
      /\.jpe?g$/i.test(file.name) &&
      starts([255, 216, 255])) ||
    (file.type === "image/webp" &&
      /\.webp$/i.test(file.name) &&
      starts([82, 73, 70, 70]) &&
      [87, 69, 66, 80].every((n, i) => bytes[i + 8] === n)) ||
    (file.type === "application/pdf" &&
      /\.pdf$/i.test(file.name) &&
      starts([37, 80, 68, 70, 45]));
  return valid
    ? null
    : "Dosyanın uzantısı, türü ve içeriği eşleşmiyor. PNG, JPG, WEBP veya PDF seç.";
}
