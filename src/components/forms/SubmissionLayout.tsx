import Link from "next/link";
export function SubmissionLayout({
  title,
  description,
  backHref,
  children,
}: {
  title: string;
  description: React.ReactNode;
  backHref?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="container-main py-8">
      <div className="user-content mx-auto w-full max-w-2xl min-w-0">
        {backHref && (
          <Link
            href={backHref}
            className="mb-5 inline-block text-sm font-semibold text-brand"
          >
            ← Şikâyete dön
          </Link>
        )}
        <h1 className="text-2xl font-black text-navy">{title}</h1>
        <div className="mb-6 mt-2 text-sm leading-6 text-muted">
          {description}
        </div>
        {children}
      </div>
    </div>
  );
}
