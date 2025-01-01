"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SlidersHorizontal } from "lucide-react";

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
          Date: Newest to Oldest
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSort("date_old_new")}>
          Date: Oldest to Newest
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
