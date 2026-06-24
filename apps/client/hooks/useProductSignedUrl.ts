import { fetchSignedUrls } from "@/containers/ProductCard";
import { useQuery } from "@tanstack/react-query";

export const useProductSignedUrls = (signedUrls?: string[] | string) => {
  return useQuery({
    queryKey: ["signedUrls", signedUrls],
    queryFn: async () => {
      if (!signedUrls) return null;
      const keysArray = Array.isArray(signedUrls) ? signedUrls : [signedUrls];
      const urls = await fetchSignedUrls(keysArray);
      return urls.length > 1 ? urls : urls[0];
    },
    enabled: !!signedUrls,
    staleTime: 1000 * 60 * 50,
  });
};
