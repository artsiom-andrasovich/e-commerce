"use client";

import { Button } from "@/components/Button";
import type { TProduct } from "@app/lib-shared-types";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type ProductCardProps = {
  product: TProduct;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const t = useTranslations("ProductCard");
  const imageUrl = product.imageUrl || null;

  return (
    <div className="flex flex-col h-[440px] border border-gray-200 rounded-lg overflow-hidden bg-white shadow">
      <div className="w-full h-56 shrink-0 bg-gray-100 flex items-center justify-center p-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
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
          {product.price}$
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
    </div>
  );
};
