import { TGetProductsResponse, TProduct } from "@app/lib-shared-types";
import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "./products.actions";

export const useProducts = (
  categoryId?: string | null,
  search?: string | null,
  initialData?: TGetProductsResponse,
) => {
  const [products, setProducts] = useState<TProduct[]>(initialData?.data || []);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialData?.nextCursor || null,
  );
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  useEffect(() => {
    setProducts(initialData?.data || []);
    setNextCursor(initialData?.nextCursor || null);
  }, [initialData]);

  const hasNextPage = !!nextCursor;

  const fetchNextPage = useCallback(async () => {
    if (!nextCursor || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const response = await fetchProducts(categoryId, search, nextCursor);
      setProducts((prev) => [...prev, ...response.data]);
      setNextCursor(response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch next products page:", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [categoryId, search, nextCursor, isFetchingNextPage]);

  return {
    products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
