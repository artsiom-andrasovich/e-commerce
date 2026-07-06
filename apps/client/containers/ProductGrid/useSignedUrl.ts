import { useEffect, useState } from "react";
import { env } from "@/configs/env";

export const useSignedUrl = (imageKey?: string | null) => {
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!imageKey) {
      setUrl(undefined);
      return;
    }

    const fetchUrl = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `${env.NEXT_PUBLIC_API_URL}/api/upload/${encodeURIComponent(imageKey)}`,
        );
        if (!res.ok) throw new Error("Failed to get image url");
        const data = await res.json();
        setUrl(data.url as string);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUrl();
  }, [imageKey]);

  return { data: url, isLoading };
};
