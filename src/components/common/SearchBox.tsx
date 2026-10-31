import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBoxProps {
  className?: string;
  size?: "md" | "lg";
  placeholder?: string;
  autoFocus?: boolean;
}

/** /deneyimler?q=... adresine GET ile giden arama kutusu */
export function SearchBox({
  className,
  size = "md",
  placeholder = "Şikâyet konusu veya şehir ara",
  autoFocus,
}: SearchBoxProps) {
  const lg = size === "lg";
  return (
    <form
      action="/deneyimler"
      method="get"
      role="search"
      className={cn(
        "relative flex w-full items-center rounded-full border bg-white transition-shadow focus-within:shadow-[0_0_0_3px_rgba(0,163,131,.15)]",
        lg
          ? "h-[52px] border-white pl-4 pr-1.5 shadow-lg sm:h-14 sm:pl-5"
          : "h-11 border-line bg-page pl-4 pr-1 focus-within:border-brand focus-within:bg-white",
        className,
      )}
    >
      <Search
        className={cn("shrink-0 text-subtle", lg ? "h-5 w-5" : "h-4 w-4")}
      />
      <input
        type="search"
        name="q"
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        aria-label="Şikâyet ara"
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent px-3 text-ink placeholder:text-subtle focus:outline-none",
          lg ? "text-base" : "text-sm",
        )}
      />
      <button
        type="submit"
        className={cn(
          "btn btn-primary shrink-0",
          lg ? "h-10 px-5 sm:h-11 sm:px-7" : "h-9 px-4 text-[13px]",
        )}
      >
        Ara
      </button>
    </form>
  );
}
