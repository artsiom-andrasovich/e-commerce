"use client";

import { TGetProductsResponse } from "@app/lib-shared-types";
import { ShoppingBag } from "lucide-react";
import { useEffect, useRef } from "react";
import { useInView } from "@/hooks/useInView";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { useProducts } from "./useProducts";

type ProductGridProps = {
  categoryId?: string | null;
  search?: string | null;
  initialData?: TGetProductsResponse;
};

export const ProductGrid = ({
  categoryId,
  search,
  initialData,
}: ProductGridProps) => {
  const t = useTranslations("ProductGrid");
  const { products, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProducts(categoryId, search, initialData);

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
        <div className="rounded-full bg-gray-100 p-4">
          <ShoppingBag className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          {t("noProducts")}
        </h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          {t("noProductsDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <p className="text-gray-500">{t("loadingMore")}</p>
        </div>
      )}

      <div ref={ref} className="h-4 w-full" />

      {!hasNextPage && products.length > 0 && (
        <div className="text-center pb-4">
          <p className="text-sm text-gray-500">
            {t("endOfCatalog")}
          </p>
        </div>
      )}
    </div>
  );
};
