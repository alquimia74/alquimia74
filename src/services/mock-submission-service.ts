import { type Submission } from "@/types/submission";

/**
 * Mock Submission Service
 * Bu aşamada gerçek veri gönderimi yapılmaz.
 * İleride Supabase ile değiştirilecektir.
 */
export const mockSubmissionService = {
  /**
   * Demo modu: hiçbir veri sunucuya gönderilmez.
   * Gerçek sistem aktif olduğunda bu metot Supabase insert ile değiştirilir.
   */
  submit: async (_submission: Partial<Submission>): Promise<{ success: false; demo: true }> => {
    // Simulated delay
    await new Promise((r) => setTimeout(r, 800));
    return { success: false, demo: true };
  },
};
