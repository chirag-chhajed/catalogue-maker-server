"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Implement search functionality
    console.log("Searching for:", e.target.value);
  };

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Search catalogues..."
        value={searchTerm}
        onChange={handleSearch}
        className="pl-8"
      />
    </div>
  );
}
