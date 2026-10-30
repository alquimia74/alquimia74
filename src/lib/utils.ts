import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Türkçe karakterleri URL-dostu slug'a çevirir */
export function slugify(text: string): string {
  const trMap: Record<string, string> = {
    ç: "c", Ç: "C", ğ: "g", Ğ: "G", ı: "i", İ: "I",
    ö: "o", Ö: "O", ş: "s", Ş: "S", ü: "u", Ü: "U",
  };
  return text
    .split("")
    .map((c) => trMap[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Tarihi Türkçe okunabilir biçime çevirir */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Çalışma dönemini okunabilir biçime çevirir */
export function formatPeriod(start: string, end?: string): string {
  const s = new Date(start).toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
  if (!end) return `${s} – (devam)`;
  const e = new Date(end).toLocaleDateString("tr-TR", { year: "numeric", month: "long" });
  return `${s} – ${e}`;
}
