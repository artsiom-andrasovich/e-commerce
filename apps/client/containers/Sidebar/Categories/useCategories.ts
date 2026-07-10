import { TCategory, TGetCategoriesResponse } from "@app/lib-shared-types";
import { useCallback, useState } from "react";
import { fetchCategories } from "./categories.actions";

export const useCategories = (initialData: TGetCategoriesResponse) => {
  const [categories, setCategories] = useState<TCategory[]>(initialData.data);
  const [nextPage, setNextPage] = useState<number | null>(initialData.nextPage);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const hasNextPage = !!nextPage;

  const fetchNextPage = useCallback(async () => {
    if (!nextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const response = await fetchCategories(nextPage);
      setCategories((prev) => [...prev, ...response.data]);
      setNextPage(response.nextPage);
    } catch (error) {
      console.error("Failed to fetch next categories page:", error);
    } finally {
      setIsFetchingNextPage(false);
    }
  }, [nextPage, isFetchingNextPage]);

  return {
    categories,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
