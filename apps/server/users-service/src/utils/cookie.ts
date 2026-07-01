import { Request } from "express";

export function extractCookie(req: Request, key?: string) {
	return key && key in req.cookies ? req.cookies[key] : key ? null : req.cookies;
}
