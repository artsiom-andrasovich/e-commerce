import { TGetProductsResponse, TProduct } from "@app/lib-shared-types";
import { useCallback, useState } from "react";
import { fetchProducts } from "./actions";

export const useProducts = (
  categoryId?: string | null,
  initialData?: TGetProductsResponse,
) => {
  const [products, setProducts] = useState<TProduct[]>(
    initialData?.data || [],
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData?.nextCursor || null,
  );
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const hasNextPage = !!nextCursor;

  const fetchNextPage = useCallback(async () => {
    if (!nextCursor || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const response = await fetchProducts(categoryId, nextCursor);
      setProducts((prev) => [...prev, ...response.data]);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch next products page:", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [categoryId, nextCursor, isFetchingNextPage]);

  return {
    products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
