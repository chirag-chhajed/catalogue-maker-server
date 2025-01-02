"use client";

import Link from "next/link";
import CatalogueItemList from "./components/catalogue-item-list";
import FilterSort from "./components/filter-sort";
import SearchBar from "./components/search-bar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { use } from "react";
import SettingsMenu from "../components/settings-menu";

const CatalogueDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Title</h1>
          <SettingsMenu />
        </header>
        <div className="flex justify-between items-center mb-6">
          <SearchBar />
          <FilterSort />
        </div>
        <CatalogueItemList catalogueId={id} />
      </main>
      <div className="fixed bottom-8 right-8">
        <Link href={`/catalogues/${id}/create`}>
          <Button size="lg" className="rounded-full w-16 h-16">
            <PlusIcon className="w-8 h-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CatalogueDetailPage;
