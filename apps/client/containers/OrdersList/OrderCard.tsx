import { TOrder } from "@app/lib-shared-types";
import { useLocale, useTranslations } from "next-intl";

type OrderCardProps = {
  order: TOrder;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const t = useTranslations("MyOrders");
  const locale = useLocale();

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: order.currency,
  });

  const formattedPrice = formatter.format(order.totalAmount);
  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString(locale) : "";

  return (
    <div className="border border-gray-200 rounded p-4 mb-4 bg-white text-sm">
      <div className="flex justify-between border-b pb-2 mb-2 font-medium">
        <div>
          {t("orderNo")} {order.id}
          <span className="text-gray-500 ml-2">({formattedDate})</span>
        </div>
        <span className="font-semibold">{order.status}</span>
      </div>

      <div className="divide-y">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between py-1.5 text-gray-700">
            <span>{item.product?.title || "Product"} (x{item.quantity})</span>
            <span>{formatter.format(item.priceAtPurchase * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-2 mt-2 font-semibold">
        <span className="text-xs text-gray-500">
          {order.deliveryMethod} / {order.paymentMethod}
        </span>
        <span className="text-base text-gray-900">{t("total")} {formattedPrice}</span>
      </div>
    </div>
  );
};
