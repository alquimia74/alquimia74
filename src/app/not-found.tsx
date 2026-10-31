import Link from "next/link";
import { Home } from "lucide-react";
import { SearchBox } from "@/components/common/SearchBox";

export default function NotFound() {
  return (
    <div className="container-main flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full max-w-lg p-10 text-center">
        <p className="text-7xl font-black tracking-tighter text-brand">404</p>
        <h1 className="mt-2 text-xl font-black text-navy">Sayfa bulunamadı</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
          Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
          Şikâyetler arasında arama yapabilirsiniz.
        </p>
        <SearchBox className="mt-6" />
        <Link href="/" className="btn btn-secondary mt-4">
          <Home className="h-4 w-4" /> Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}
