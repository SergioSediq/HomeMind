import { Request, Response, NextFunction } from "express";
import { chatBodySchema } from "../validations/chat.validation";

export function validateChatBody(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = chatBodySchema.safeParse(req.body);
  if (!result.success) {
    const first = result.error.issues[0];
    const msg =
      (first && "message" in first ? String(first.message) : null) ||
      "Invalid request body";
    return res.status(400).json({ error: msg });
  }
  next();
}
