"use client";

import { TOrder } from "@app/lib-shared-types";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { OrderCard } from "./OrderCard";
import { useOrders } from "./useOrders";
import { useInView } from "@/hooks/useInView";

type OrdersListProps = {
  initialOrders: TOrder[];
  initialNextPage: number | null;
};

export const OrdersList = ({ initialOrders, initialNextPage }: OrdersListProps) => {
  const t = useTranslations("MyOrders");
  const tGrid = useTranslations("ProductGrid");
  const { orders, hasNextPage, fetchNextPage, isLoading } = useOrders(
    initialOrders,
    initialNextPage,
  );

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, {
    rootMargin: "200px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isLoading, fetchNextPage]);

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t("title")}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500 text-lg">{t("noOrders")}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}

          {isLoading && (
            <div className="flex justify-center py-4">
              <p className="text-gray-500">{tGrid("loadingMore")}</p>
            </div>
          )}

          <div ref={ref} className="h-4 w-full" />
        </div>
      )}
    </div>
  );
};
