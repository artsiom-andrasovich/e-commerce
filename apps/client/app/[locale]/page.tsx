import { ProductGrid, fetchProducts } from "@/containers/ProductGrid/";

export default async function Home(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const categoryId =
    typeof searchParams?.categoryId === "string"
      ? searchParams.categoryId
      : null;
  const initialData = await fetchProducts(categoryId, undefined);

  return (
    <div className="mx-auto max-w-7xl">
      <ProductGrid categoryId={categoryId} initialData={initialData} />
    </div>
  );
}
