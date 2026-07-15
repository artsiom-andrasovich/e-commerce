import { Request } from "express";

export function extractCookie(req: Request, key?: string) {
  if (!key) {
    return req.cookies;
  }
  return req.cookies?.[key] ?? null;
}
