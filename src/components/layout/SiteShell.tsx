"use client";
import { usePathname } from "next/navigation";
export function SiteShell({
  children,
  header,
  footer,
  tabs,
  music,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
  tabs: React.ReactNode;
  music: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/"))
    return <main>{children}</main>;
  return (
    <div className="flex min-h-screen flex-col pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
      {header}
      <main className="flex-1">{children}</main>
      {footer}
      {tabs}
      {music}
    </div>
  );
}
