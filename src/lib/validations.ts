import { z } from "zod";

export const step1Schema = z.object({
  entity: z.string().min(1, "Lütfen ilgili kurumu seçin"),
  contractualEmployer: z.string().optional(),
});

export const step3Schema = z.object({
  employmentStart: z.string().min(1, "Çalışma başlangıç tarihi gereklidir"),
  employmentEnd: z.string().optional(),
  role: z.string().optional(),
  employmentStatus: z.enum(["former", "current", "other"]),
  city: z.string().optional(),
});

export const step4Schema = z.object({
  title: z.string().min(10, "Başlık en az 10 karakter olmalı").max(120, "Başlık en fazla 120 karakter olabilir"),
  narrative: z.string().min(100, "Anlatım en az 100 karakter olmalı").max(5000),
  approximateDates: z.string().optional(),
});

export const step6Schema = z.object({
  publishPreference: z.enum(["alias", "name_allowed", "editor_only"]),
});

export const fullSubmissionSchema = step1Schema
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step6Schema);

export type FullSubmission = z.infer<typeof fullSubmissionSchema>;
