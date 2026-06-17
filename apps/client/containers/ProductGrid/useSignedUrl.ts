import { useQuery } from "@tanstack/react-query";

export const useSignedUrl = (imageKey?: string | null) => {
  return useQuery({
    queryKey: ["imageUrl", imageKey],
    queryFn: async () => {
      if (!imageKey) return null;
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(
        `${API_URL}/api/upload/${encodeURIComponent(imageKey)}`,
      );
      if (!res.ok) throw new Error("Failed to get image url");
      const data = await res.json();
      return data.url as string;
    },
    enabled: !!imageKey,
    staleTime: 1000 * 60 * 50,
  });
};
