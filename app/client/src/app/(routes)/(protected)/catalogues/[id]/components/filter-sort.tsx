"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal, ArrowUpDown, Calendar } from "lucide-react";

export default function FilterSort() {
  const handleSort = (option: string) => {
    // Implement sort functionality
    console.log("Sorting by:", option);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSort("date_new_old")}>
          <Calendar className="mr-2 h-4 w-4" />
          Date: Newest to Oldest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("date_old_new")}>
          <Calendar className="mr-2 h-4 w-4" />
          Date: Oldest to Newest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("price_low_high")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Price: Low to High
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("price_high_low")}>
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Price: High to Low
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
