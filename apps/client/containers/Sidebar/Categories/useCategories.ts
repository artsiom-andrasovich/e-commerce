import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchCategories } from "./actions";
import { TGetCategoriesResponse } from "@app/lib-shared-types";

export const useCategories = (initialData: TGetCategoriesResponse) => {
  return useInfiniteQuery({
    queryKey: ["sidebar-categories"],
    queryFn: async ({ pageParam }) => {
      return await fetchCategories(pageParam as string | undefined);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialData: {
      pages: [initialData],
      pageParams: [undefined as string | undefined],
    },
  });
};
