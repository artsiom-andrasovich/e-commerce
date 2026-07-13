"use client";

import { TCategory } from "@app/lib-shared-types";
import { useTranslations } from "next-intl";
import { CategoryLink } from "./CategoryLink";
import { useCategories } from "./useCategories";
import { Loader2 } from "lucide-react";

type CategoryListProps = {
  initialCategories: TCategory[];
  initialPage: number | null;
};

export function CategoryList({
  initialCategories,
  initialPage,
}: CategoryListProps) {
  const { categories, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCategories({ data: initialCategories, nextPage: initialPage });

  const t = useTranslations("Sidebar");

  return (
    <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto pr-2">
      <nav className="flex flex-col space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col">
            <CategoryLink category={category} />
          </div>
        ))}
      </nav>

      {hasNextPage && (
        <button
          onClick={fetchNextPage}
          disabled={isFetchingNextPage}
          className="text-sm text-primary hover:underline self-start font-medium"
        >
          {isFetchingNextPage ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            t("seeMore")
          )}
        </button>
      )}
    </div>
  );
}
