import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import CatalogueList from "./components/catalogue-list";
import SearchBar from "./components/search-bar";
import FilterSort from "./components/filter-sort";
import SettingsMenu from "./components/settings-menu";

export default function CataloguesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Catalogues</h1>
          <SettingsMenu />
        </div>
        <div className="flex justify-between items-center mb-6">
          <SearchBar />
          <FilterSort />
        </div>

        <CatalogueList />
      </main>
      <div className="fixed bottom-8 right-8">
        <Link href="/catalogues/create">
          <Button size="lg" className="rounded-full w-16 h-16">
            <PlusIcon className="w-8 h-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
