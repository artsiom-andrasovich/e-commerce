import { ProductGrid, fetchProducts } from "@/containers/ProductGrid/";

export default async function Home() {
  const initialData = await fetchProducts(null, undefined);

  return <ProductGrid categoryId={null} initialData={initialData} />;
}
