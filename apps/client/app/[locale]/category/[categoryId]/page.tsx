import { ProductGrid, fetchProducts } from "@/containers/ProductGrid/";

import { SearchBar } from "@/containers/SearchBar";

export default async function CategoryPage(props: {
  params: Promise<{ categoryId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { categoryId } = await props.params;
  const searchParams = await props.searchParams;
  const search =
    typeof searchParams?.search === "string" ? searchParams.search : null;
  const initialData = await fetchProducts(categoryId, search, undefined);

  return (
    <div className="mx-auto max-w-7xl">
      <SearchBar />
      <ProductGrid categoryId={categoryId} search={search} initialData={initialData} />
    </div>
  );
}
