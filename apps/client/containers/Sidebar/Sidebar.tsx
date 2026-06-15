import { fetchCategories } from "./Categories/actions";
import { CategoryList } from "./Categories/CategoryList";
import { NavigationList } from "./Navigation/NavigationList";

export async function Sidebar() {
  const { data, nextCursor } = await fetchCategories();
  return (
    <aside className="p-4 bg-background border-r border-t rounded-r-md flex flex-col space-y-6">
      <NavigationList />

      <div className="h-px w-full bg-border" />

      <div className="flex flex-col space-y-4">
        <h3 className="px-2 text-md font-bold tracking-tight text-foreground">
          Categories
        </h3>
        <CategoryList initialCategories={data} initialCursor={nextCursor} />
      </div>
    </aside>
  );
}
