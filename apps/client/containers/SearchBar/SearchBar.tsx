"use client";

import { Input } from "@/components/Input";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname, useRouter } from "@/i18n";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export const SearchBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm) {
      params.set("search", debouncedSearchTerm);
    } else {
      params.delete("search");
    }

    const currentSearch = searchParams.get("search") || "";
    if (currentSearch !== debouncedSearchTerm) {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [debouncedSearchTerm, pathname, router, searchParams]);

  return (
    <div className="relative mb-6 w-full max-w-md">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      <Input
        type="text"
        className="pl-10"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};
