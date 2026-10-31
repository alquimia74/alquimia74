"use client";
import { useRef, useState } from "react";
import { PROVINCES } from "@/data/provinces";
import { X, Search, ChevronDown } from "lucide-react";
export function ProvincePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const modal = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const normalized = (s: string) =>
    s
      .toLocaleLowerCase("tr-TR")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replaceAll("ı", "i");
  const list = PROVINCES.filter((city) =>
    normalized(city).includes(normalized(query)),
  );
  return (
    <div>
      <span className="field-label" id="city-label">
        Çalıştığın il
      </span>
      <input type="hidden" name="city" value={value} />
      <button
        type="button"
        aria-labelledby="city-label"
        aria-haspopup="dialog"
        onClick={() => modal.current?.showModal()}
        className="input flex items-center justify-between text-left"
      >
        <span>{value || "İl seç"}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      <dialog
        ref={modal}
        onClose={() => setQuery("")}
        className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl border border-line bg-white p-5 text-ink shadow-xl backdrop:bg-navy/50"
        aria-labelledby="province-title"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="province-title" className="font-extrabold text-navy">
            Çalıştığın ili seç
          </h2>
          <button
            type="button"
            onClick={() => modal.current?.close()}
            aria-label="İl seçimini kapat"
            className="grid h-10 w-10 place-items-center rounded-full hover:bg-page"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <label className="relative block">
          <Search className="absolute left-3 top-3 h-5 w-5 text-subtle" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="input pl-10"
            aria-label="İl ara"
            placeholder="İl ara"
          />
        </label>
        <div className="mt-4 grid max-h-[45vh] grid-cols-2 gap-1 overflow-y-auto">
          {list.map((city) => (
            <button
              type="button"
              key={city}
              onClick={() => {
                onChange(city);
                modal.current?.close();
              }}
              className={
                "rounded-lg px-3 py-2 text-left text-sm hover:bg-brand-soft " +
                (value === city ? "bg-brand-soft font-bold text-brand" : "")
              }
            >
              {city}
            </button>
          ))}
          {!list.length && (
            <p className="col-span-2 py-5 text-center text-sm text-muted">
              İl bulunamadı.
            </p>
          )}
        </div>
      </dialog>
    </div>
  );
}
