import { TOrder } from "@app/lib-shared-types";
import { useCallback, useState } from "react";
import { fetchMyOrders } from "./orders.actions";

export const useOrders = (
  initialOrders: TOrder[],
  initialNextPage: number | null,
) => {
  const [orders, setOrders] = useState<TOrder[]>(initialOrders);
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage);
  const [isLoading, setIsLoading] = useState(false);

  const hasNextPage = !!nextPage;

  const fetchNextPage = useCallback(async () => {
    if (!nextPage || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetchMyOrders(nextPage);
      if (res && res.data) {
        setOrders((prev) => [...prev, ...res.data]);
        setNextPage(res.nextPage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [nextPage, isLoading]);

  return {
    orders,
    hasNextPage,
    fetchNextPage,
    isLoading,
  };
};
