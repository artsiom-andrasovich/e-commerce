"use client";

import { TGetProductsResponse } from "@app/lib-shared-types";
import { ShoppingBag } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "./ProductCard";
import { useProducts } from "./useProducts";

type ProductGridProps = {
  categoryId?: string | null;
  initialData?: TGetProductsResponse;
};

export const ProductGrid = ({ categoryId, initialData }: ProductGridProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useProducts(categoryId, initialData);

  const { ref, inView } = useInView({
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.data) || [];

  if (status === "pending") {
    return (
      <div className="flex justify-center py-10">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl bg-red-50 p-8 text-center">
        <h3 className="text-lg font-semibold text-red-800">
          Something went wrong.
        </h3>
        <p className="mt-2 text-sm text-red-600">
          Failed to load products. Please try again later.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
        <div className="rounded-full bg-gray-100 p-4">
          <ShoppingBag className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          No products found
        </h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          We couldn't find any products in this category. Try selecting a
          different category or check back later.
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
          <p className="text-gray-500">Loading more...</p>
        </div>
      )}

      <div ref={ref} className="h-4 w-full" />

      {!hasNextPage && products.length > 0 && (
        <div className="text-center pb-4">
          <p className="text-sm text-gray-500">
            You've reached the end of the catalog.
          </p>
        </div>
      )}
    </div>
  );
};
