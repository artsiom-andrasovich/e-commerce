import { ProductGrid, fetchProducts } from "@/containers/ProductGrid/";

export default async function CategoryPage(props: {
  params: Promise<{ categoryId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryId } = await props.params;
  const searchParams = await props.searchParams;
  const search =
    typeof searchParams?.search === "string" ? searchParams.search : null;
  const initialData = await fetchProducts(categoryId, search, undefined);

  return <ProductGrid categoryId={categoryId} search={search} initialData={initialData} />;
}
