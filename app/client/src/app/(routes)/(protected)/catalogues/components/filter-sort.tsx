"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { catalogueApi } from "@/store/features/api/catalogueApi";
import { useAppDispatch } from "@/store/hooks";
import { SlidersHorizontal, Check } from "lucide-react";

type SortOrder = "newest" | "oldest" | null;

export default function FilterSort() {
  const dispatch = useAppDispatch();
  const [activeSort, setActiveSort] = useState<SortOrder>(null);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={activeSort ? "secondary" : "outline"}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {activeSort === "newest"
            ? "Newest First"
            : activeSort === "oldest"
              ? "Oldest First"
              : "Sort"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setActiveSort("newest");
            dispatch(
              catalogueApi.util.updateQueryData(
                "getCatalog",
                undefined,
                (data) => {
                  data.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  );
                }
              )
            );
          }}
        >
          <Check
            className={`mr-2 h-4 w-4 ${activeSort === "newest" ? "opacity-100" : "opacity-0"}`}
          />
          Date: Newest to Oldest
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setActiveSort("oldest");
            dispatch(
              catalogueApi.util.updateQueryData(
                "getCatalog",
                undefined,
                (data) => {
                  data.sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  );
                }
              )
            );
          }}
        >
          <Check
            className={`mr-2 h-4 w-4 ${activeSort === "oldest" ? "opacity-100" : "opacity-0"}`}
          />
          Date: Oldest to Newest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
