import { ProductGrid, fetchProducts } from "@/containers/ProductGrid/";
import { SearchBar } from "@/containers/SearchBar";

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const search =
    typeof searchParams?.search === "string"
      ? searchParams.search
      : null;
  const initialData = await fetchProducts(null, search, undefined);

  return (
    <div className="mx-auto max-w-7xl">
      <SearchBar />
      <ProductGrid categoryId={null} search={search} initialData={initialData} />
    </div>
  );
}
