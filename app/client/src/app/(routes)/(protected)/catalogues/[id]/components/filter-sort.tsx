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
import { SlidersHorizontal, ArrowUpDown, Calendar, Check } from "lucide-react";

type SortType = "newest" | "oldest" | "lowPrice" | "highPrice" | null;

export default function FilterSort({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [activeSort, setActiveSort] = useState<SortType>(null);

  const getSortLabel = (sort: SortType) => {
    switch (sort) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "lowPrice":
        return "Price: Low to High";
      case "highPrice":
        return "Price: High to Low";
      default:
        return "Sort";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={activeSort ? "secondary" : "outline"}>
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {getSortLabel(activeSort)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            setActiveSort("newest");
            dispatch(
              catalogueApi.util.updateQueryData(
                "getCatalogItems",
                { id },
                (data) => {
                  data.items.sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  );
                }
              )
            );
          }}
        >
          <div className="w-4 mr-2">
            {activeSort === "newest" && <Check className="h-4 w-4" />}
          </div>
          <Calendar className="mr-2 h-4 w-4" />
          Date: Newest to Oldest
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setActiveSort("oldest");
            dispatch(
              catalogueApi.util.updateQueryData(
                "getCatalogItems",
                { id },
                (data) => {
                  data.items.sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  );
                }
              )
            );
          }}
        >
          <div className="w-4 mr-2">
            {activeSort === "oldest" && <Check className="h-4 w-4" />}
          </div>
          <Calendar className="mr-2 h-4 w-4" />
          Date: Oldest to Newest
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setActiveSort("lowPrice");
            dispatch(
              catalogueApi.util.updateQueryData(
                "getCatalogItems",
                { id },
                (data) => {
                  data.items.sort((a, b) => a.price - b.price);
                }
              )
            );
          }}
        >
          <div className="w-4 mr-2">
            {activeSort === "lowPrice" && <Check className="h-4 w-4" />}
          </div>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Price: Low to High
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => {
            setActiveSort("highPrice");
            dispatch(
              catalogueApi.util.updateQueryData(
                "getCatalogItems",
                { id },
                (data) => {
                  data.items.sort((a, b) => b.price - a.price);
                }
              )
            );
          }}
        >
          <div className="w-4 mr-2">
            {activeSort === "highPrice" && <Check className="h-4 w-4" />}
          </div>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Price: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
