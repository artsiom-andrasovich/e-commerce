"use client";

import { Link, usePathname } from "@/i18n";
import { cn } from "@/lib/utils";
import { TCategory } from "@app/lib-shared-types";

type CategoryLinkProps = {
  category: TCategory;
};

export function CategoryLink({ category }: CategoryLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.endsWith(`/category/${category.id}`);

  return (
    <Link
      href={`/category/${category.id}`}
      className={cn(
        "p-2 text-sm font-medium rounded-md transition-colors",
        isActive
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {typeof category.name === "string"
        ? category.name
        : category.name?.["en"] || "Unknown"}
    </Link>
  );
}
