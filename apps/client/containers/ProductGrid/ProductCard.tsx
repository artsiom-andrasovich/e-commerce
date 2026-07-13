"use client";

import { Button } from "@/components/Button";

import { Link } from "@/i18n/navigation";
import type { TProductListItem } from "@app/lib-shared-types";
import { ImageOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

type ProductCardProps = {
  product: TProductListItem;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const t = useTranslations("ProductCard");
  const locale = useLocale();
  const imageUrl = product.imageUrl || null;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: product.currency || "USD",
  }).format(product.price);

  return (
    <Link
      href={`/product/${product.id}`}
      className="flex flex-col h-[440px] border border-gray-200 rounded-lg overflow-hidden bg-white shadow"
    >
      <div className="w-full h-56 shrink-0 bg-gray-100 flex items-center justify-center p-4">
        {imageUrl ? (
          <Image
            src={imageUrl as string}
            alt={product.title}
            width={200}
            height={200}
            unoptimized={true}
            className="object-contain"
          />
        ) : (
          <ImageOff className="w-12 h-12 text-gray-400" />
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-lg font-bold text-gray-900 truncate">
          {product.title}
        </h3>
        <span className="text-blue-600 font-semibold mt-1">
          {formattedPrice}
        </span>

        {product.description && (
          <div className="mt-2 h-10">
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          </div>
        )}

        <div className="mt-auto pt-4">
          <Button className="w-full">{t("addToCart")}</Button>
        </div>
      </div>
    </Link>
  );
};
