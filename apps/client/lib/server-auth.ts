"use server";

import { redirect } from "@/i18n";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

export async function setAuthCookies(accessToken: string) {
  (await cookies()).set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
  });
}

export async function redirectWithLocale(path: string = "/") {
  const locale = await getLocale();
  redirect({ href: path, locale });
}
