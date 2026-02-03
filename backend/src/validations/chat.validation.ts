import { z } from "zod";

const historyEntrySchema = z.object({
  role: z.enum(["user", "model"]),
  parts: z.array(z.object({ text: z.string() })).optional(),
  text: z.string().optional(),
});

export const chatBodySchema = z.object({
  message: z.string().min(1, "Message is required").max(10000),
  convoId: z.string().optional(),
  history: z.array(historyEntrySchema).optional(),
  expertWeights: z.record(z.string(), z.number()).optional(),
});

export type ChatBody = z.infer<typeof chatBodySchema>;
