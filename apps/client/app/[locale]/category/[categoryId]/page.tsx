import { ProductGrid, fetchProducts } from "@/containers/ProductGrid/";

export default async function CategoryPage(props: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await props.params;
  const initialData = await fetchProducts(categoryId, undefined);

  return <ProductGrid categoryId={categoryId} initialData={initialData} />;
}
