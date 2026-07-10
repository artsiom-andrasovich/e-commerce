import { getTranslations } from "next-intl/server";
import { fetchCategories } from "./Categories/categories.actions";
import { CategoryList } from "./Categories/CategoryList";
import { NavigationList } from "./Navigation/NavigationList";

export async function Sidebar() {
  const t = await getTranslations("Sidebar");
  const { data, nextPage } = await fetchCategories();
  return (
    <aside className="w-64 shrink-0 p-4 bg-background border rounded-md flex flex-col space-y-6">
      <NavigationList />

      <div className="h-px w-full bg-border" />

      <div className="flex flex-col space-y-4">
        <h3 className="px-2 text-md font-bold tracking-tight text-foreground">
          {t("categories")}
        </h3>
        <CategoryList initialCategories={data} initialPage={nextPage} />
      </div>
    </aside>
  );
}
