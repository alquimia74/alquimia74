"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, FileText as FilePdf } from "lucide-react";
import { type FormData } from "../SubmissionForm";
import { Notice, StepShell } from "./StepShell";
import { cn } from "@/lib/utils";

interface Props {
  data: FormData;
  update: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
const MAX_SIZE_MB = 10;

export function Step5Documents({ data, update, onNext, onBack }: Props) {
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const errs: string[] = [];
      const valid: File[] = [];

      Array.from(incoming).forEach((file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
          errs.push(`${file.name}: Desteklenmeyen dosya türü (PNG, JPG, WEBP, PDF)`);
          return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
          errs.push(`${file.name}: Dosya boyutu ${MAX_SIZE_MB}MB'ı aşıyor`);
          return;
        }
        valid.push(file);
      });

      setErrors(errs);
      update({ files: [...data.files, ...valid] });
    },
    [data.files, update]
  );

  const removeFile = (index: number) => {
    const updated = data.files.filter((_, i) => i !== index);
    update({ files: updated });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  return (
    <StepShell
      title="Belge ekle"
      description="İsteğe bağlı. PNG, JPG, WEBP veya PDF dosyası ekleyebilirsin."
      onBack={onBack}
      onNext={onNext}
      nextLabel={data.files.length ? "Devam Et" : "Belgesiz Devam Et"}
    >
      <Notice tone="warn">
        Bu demo sürümde dosyalar <strong>sunucuya gönderilmez</strong>, yalnızca tarayıcı belleğinde
        önizleme oluşturulur. Kişisel bilgiler içeren belgeleri bu aşamada yüklemeni önermeyiz.
      </Notice>

      <div
        role="button"
        tabIndex={0}
        aria-label="Dosya yüklemek için tıklayın veya sürükleyin"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "mt-5 cursor-pointer rounded-xl border-2 border-dashed p-10 text-center transition-colors",
          dragging ? "border-brand bg-brand-soft" : "border-line hover:border-brand hover:bg-brand-soft/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.webp,.pdf"
          className="sr-only"
          onChange={(e) => addFiles(e.target.files)}
        />
        <span className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand">
          <Upload className="h-6 w-6" />
        </span>
        <p className="text-sm font-semibold text-ink">
          Dosyaları buraya sürükle ya da <span className="text-brand underline">seç</span>
        </p>
        <p className="mt-1 text-xs text-subtle">PNG, JPG, WEBP, PDF — maks. {MAX_SIZE_MB}MB</p>
      </div>

      {errors.length > 0 && (
        <div className="mt-4 space-y-1 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {errors.map((e, i) => <p key={i}>⚠ {e}</p>)}
        </div>
      )}

      {data.files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {data.files.map((file, i) => {
            const isImage = file.type.startsWith("image/");
            const previewUrl = isImage ? URL.createObjectURL(file) : null;
            return (
              <li key={i} className="flex items-center gap-3 rounded-lg border border-line bg-white p-3">
                {isImage && previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt={file.name} className="h-10 w-10 shrink-0 rounded-md object-cover" />
                ) : (
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-navy-soft">
                    <FilePdf className="h-5 w-5 text-navy" />
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
                  <p className="text-xs text-subtle">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                  className="rounded-md p-1.5 text-subtle transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`${file.name} dosyasını kaldır`}
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </StepShell>
  );
}
