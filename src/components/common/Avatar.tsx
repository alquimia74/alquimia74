import { cn } from "@/lib/utils";

const PALETTE = [
  "bg-brand-soft text-brand-dark",
  "bg-navy-soft text-navy",
  "bg-accent-soft text-[#8a5a00]",
];

function pick(seed: string) {
  let n = 0;
  for (const ch of seed) n += ch.charCodeAt(0);
  return n;
}

/** Baş harfli yuvarlak kullanıcı avatarı */
export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full font-extrabold",
        PALETTE[pick(name) % PALETTE.length],
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {name.trim().charAt(0).toLocaleUpperCase("tr-TR")}
    </span>
  );
}

/** Kurum için kare logo yer tutucu (gerçek logo olmadığından baş harf) */
export function EntityLogo({ name, size = 48, className }: { name: string; size?: number; className?: string }) {
  const dark = pick(name) % 2 === 0;
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-xl border font-black",
        dark ? "border-navy bg-navy text-white" : "border-brand-line bg-white text-brand",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {name.replace(/[^\p{L}\p{N}]/gu, "").charAt(0).toLocaleUpperCase("tr-TR")}
    </span>
  );
}
