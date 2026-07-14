import { env } from "@/configs";
import { cookies } from "next/headers";

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  const headers = new Headers(options.headers || {});

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", token.value);
  }

  let res = await fetch(url, { ...options, headers });

  if (res.status === 401) {
    const refreshToken = cookieStore.get("refreshToken");
    if (!refreshToken) return res;

    const refreshRes = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        headers: {
          Cookie: `refreshToken=${refreshToken.value}`,
        },
      },
    );

    if (refreshRes.ok) {
      const data = await refreshRes.json();

      cookieStore.set("accessToken", data.accessToken, {
        httpOnly: true,
        path: "/",
      });

      const setCookieHeader = refreshRes.headers.get("set-cookie");
      if (setCookieHeader) {
        const match = setCookieHeader.match(/refreshToken=([^;]+)/);
        if (match && match[1]) {
          cookieStore.set("refreshToken", match[1], {
            httpOnly: true,
            path: "/",
            sameSite: "lax",
          });
        }
      }

      headers.set("Authorization", data.accessToken);
      res = await fetch(url, { ...options, headers });
    }
  }

  return res;
}
