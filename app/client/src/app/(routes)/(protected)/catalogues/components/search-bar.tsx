"use client";

import { Input } from "@/components/ui/input";
import {
  catalogueApi,
  type GetCatalogues,
} from "@/store/features/api/catalogueApi";
import { useAppDispatch } from "@/store/hooks";
import { XCircle as XCircleIcon, Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useRef } from "react";
import { useDebounceValue } from "usehooks-ts";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useQueryState("search", {
    defaultValue: "",
  });
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 1000);
  const dispatch = useAppDispatch();
  const originalDataRef = useRef<GetCatalogues>(null);

  useEffect(() => {
    try {
      dispatch(
        catalogueApi.util.updateQueryData("getCatalog", undefined, (data) => {
          // Create safe copies of proxy objects
          const safeData = data.map((item) => ({ ...item }));

          // Store original on first render
          if (!originalDataRef.current) {
            originalDataRef.current = safeData;
          }

          if (!debouncedSearchTerm) {
            return originalDataRef.current;
          }

          return safeData.filter(
            (item) =>
              item.name
                .toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase()) ||
              item.description
                ?.toLowerCase()
                .includes(debouncedSearchTerm.toLowerCase())
          );
        })
      );
    } catch (error) {
      console.error("Search filter error:", error);
      return originalDataRef.current || [];
    }
  }, [debouncedSearchTerm, dispatch]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Search catalogues..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-8 pr-8"
      />
      {searchTerm ? (
        <XCircleIcon
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
          onClick={() => setSearchTerm("")}
        />
      ) : null}
    </div>
  );
}
