"use client";

import { Link } from "@/i18n";
import { TCategory } from "@app/lib-shared-types";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

type CategoryLinkProps = {
  category: TCategory;
};

export function CategoryLink({ category }: CategoryLinkProps) {
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");

  const isActive = currentCategoryId === category.id;

  return (
    <Link
      href={`/?categoryId=${category.id}`}
      className={cn(
        "p-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {category.name}
    </Link>
  );
}
