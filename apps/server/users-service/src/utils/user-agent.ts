import { Request } from "express";

export function extractAgent(req: Request): string {
  return req.headers["user-agent"] || "Unknown";
}
