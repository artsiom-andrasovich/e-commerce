import { fetchProductById, ProductCard } from "@/containers/ProductCard";

export default async function Product(props: {
  params: Promise<{ productId: string }>;
}) {
  const params = await props.params;
  const productId = params.productId;
  const product = await fetchProductById(productId);

  return (
    <div className="mx-auto max-w-7xl">
      <ProductCard product={product} />
    </div>
  );
}
