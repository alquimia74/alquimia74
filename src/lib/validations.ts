import { z } from "zod";
import { PROVINCES } from "@/data/provinces";
export const workerSubmissionSchema = z.object({
  title: z.string().trim().min(10).max(120),
  narrative: z.string().trim().min(100).max(5000),
  city: z.enum(PROVINCES),
  staffType: z.enum(["affiliate", "headquarters"]),
  period: z.string().trim().max(100).optional(),
});
export const employerReplySchema = z.object({
  role: z.string().trim().min(2).max(120),
  name: z.string().trim().min(2).max(120),
  reply: z.string().trim().min(20).max(5000),
});
