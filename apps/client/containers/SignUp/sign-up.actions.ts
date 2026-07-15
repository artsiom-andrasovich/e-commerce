"use server";

import { env } from "@/configs";
import { redirectWithLocale, setAuthCookies } from "@/lib/server-auth";
import { createUserDto } from "@app/lib-shared-types";
import { z } from "zod";

type SignUpInput = z.input<typeof createUserDto>;

export async function signUpAction(data: SignUpInput) {
  const parsed = createUserDto.safeParse(data);

  if (!parsed.success) {
    return {
      error: `Invalid inputs`,
    };
  }

  try {
    const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/auth/sign-up`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        error: errorData?.message || "Please try again.",
      };
    }

    const result = await res.json();

const setCookieHeader = res.headers.get("set-cookie");
const refreshToken = setCookieHeader?.match(/refreshToken=([^;]+)/)?.[1];

    if (result.accessToken) {
      await setAuthCookies(result.accessToken, refreshToken);
    }
  } catch (error) {
    console.error(error);
    return { error: "Server error" };
  }

  await redirectWithLocale("/");
}
