import { ProductGrid, fetchProducts } from "@/containers/ProductGrid/";
import { SearchBar } from "@/containers/SearchBar";

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryId =
    typeof searchParams?.categoryId === "string"
      ? searchParams.categoryId
      : null;
  const search =
    typeof searchParams?.search === "string"
      ? searchParams.search
      : null;
  const initialData = await fetchProducts(categoryId, search, undefined);

  return (
    <div className="mx-auto max-w-7xl">
      <SearchBar />
      <ProductGrid categoryId={categoryId} search={search} initialData={initialData} />
    </div>
  );
}
