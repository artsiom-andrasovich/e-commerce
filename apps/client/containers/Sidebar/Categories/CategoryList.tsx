"use client";

import { TCategory } from "@app/lib-shared-types";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { CategoryLink } from "./CategoryLink";
import { useCategories } from "./useCategories";

type CategoryListProps = {
  initialCategories: TCategory[];
  initialCursor: string | null;
};

export function CategoryList({
  initialCategories,
  initialCursor,
}: CategoryListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategories({ data: initialCategories, nextCursor: initialCursor });

  const categories = data.pages.flatMap((page) => page.data) || [];

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <nav className="flex flex-col overflow-y-auto max-h-96 pr-2">
      {categories.map((category, idx) => (
        <div
          key={category.id}
          className="flex flex-col mb-2"
          ref={idx === categories.length - 3 ? ref : null}
        >
          <CategoryLink category={category} />
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <span className="inline-block w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </nav>
  );
}
