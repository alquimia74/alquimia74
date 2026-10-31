"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Home, Info, List, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Ana Sayfa", icon: Home },
  { href: "/deneyimler", label: "Şikâyetler", icon: List },
  {
    href: "/deneyimini-paylas",
    label: "Hazırla",
    icon: PenLine,
    primary: true,
  },
  { href: "/kurumlar", label: "Kurumlar", icon: Building2 },
  { href: "/nasil-calisir", label: "Nasıl?", icon: Info },
];

/** Mobilde sabit alt gezinme çubuğu (lg altında görünür) */
export function MobileTabBar() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav
      aria-label="Mobil gezinme"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid h-16 max-w-md grid-cols-5">
        {TABS.map(({ href, label, icon: Icon, primary }) => {
          const active = isActive(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-0.5 text-[11px] font-semibold",
                  primary
                    ? "text-brand"
                    : active
                      ? "text-brand"
                      : "text-subtle",
                )}
              >
                {primary ? (
                  <span className="-mt-6 grid h-12 w-12 place-items-center rounded-full bg-brand text-white shadow-[0_6px_16px_rgba(0,163,131,.4)] ring-4 ring-white">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : (
                  <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
                )}
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
