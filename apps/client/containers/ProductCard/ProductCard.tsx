import type { TProduct } from "@app/lib-shared-types";
import { ImageOff } from "lucide-react";
import { ImageCarousel } from "../ImageCarousel";
import { getLocale } from "next-intl/server";
import { AddToCartButton } from "./AddToCartButton";

export async function ProductCard({ product }: { product: TProduct }) {
  const imageUrls = product.imageUrls || [];

  const carouselImages = imageUrls.map((url, index) => ({
    id: String(index),
    url,
  }));

  const locale = await getLocale();
  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: product.currency || "USD",
  }).format(product.price);

  return (
    <div className="flex flex-col gap-4">
      <div className="mx-auto w-full max-w-2xl">
        {carouselImages.length > 0 ? (
          <ImageCarousel images={carouselImages} />
        ) : (
          <div className="flex h-[400px] w-full items-center justify-center rounded-xl bg-gray-100">
            <ImageOff className="h-16 w-16 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>

        <span className="text-2xl font-semibold text-blue-600">
          {formattedPrice}
        </span>

        {product.description && (
          <p className="text-gray-600">{product.description}</p>
        )}
        <div className="mt-4">
          <AddToCartButton productId={product.id!} />
        </div>
      </div>
    </div>
  );
}
