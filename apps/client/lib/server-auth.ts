"use server";

import { redirect } from "@/i18n";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";

export async function setAuthCookies(accessToken: string, refreshToken?: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
    path: "/",
  });

  if (refreshToken) {
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
    });
  }
}

export async function redirectWithLocale(path: string = "/") {
  const locale = await getLocale();
  redirect({ href: path, locale });
}

export async function hasAuthToken(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has("accessToken");
}
