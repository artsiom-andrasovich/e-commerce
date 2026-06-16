import { TGetProductsResponse } from "@app/lib-shared-types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "./actions";

export const useProducts = (
  categoryId?: string | null,
  initialData?: TGetProductsResponse,
) => {
  return useInfiniteQuery({
    queryKey: ["products", categoryId],
    queryFn: async ({ pageParam }) => {
      return await fetchProducts(categoryId, pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    ...(initialData && {
      initialData: {
        pages: [initialData],
        pageParams: [undefined as string | undefined],
      },
    }),
  });
};
