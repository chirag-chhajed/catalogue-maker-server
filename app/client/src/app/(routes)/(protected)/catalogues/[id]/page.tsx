import Link from "next/link";
import CatalogueItemList from "./components/catalogue-item-list";
import FilterSort from "./components/filter-sort";
import SearchBar from "./components/search-bar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const CatalogueDetailPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">title</h1>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <SearchBar />
          <FilterSort />
        </div>
        <CatalogueItemList catalogueId={params.id} />
      </main>
      <div className="fixed bottom-8 right-8">
        <Link href={`/catalogues/create`}>
          <Button size="lg" className="rounded-full w-16 h-16">
            <PlusIcon className="w-8 h-8" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CatalogueDetailPage;
