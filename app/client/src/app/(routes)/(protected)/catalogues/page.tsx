import CatalogueList from "./components/catalogue-list";
// import SearchBar from "./components/search-bar";
import FilterSort from "./components/filter-sort";
import SettingsMenu from "./components/settings-menu";
import { CreateCatalogueButton } from "./components/create-catalogue-button";

export default function CataloguesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Your Catalogues</h1>
          <SettingsMenu />
        </header>
        <div className="flex justify-between items-center mb-6">
          {/* <SearchBar /> */}
          <FilterSort />
        </div>
        <CatalogueList />
      </main>
      <CreateCatalogueButton />
    </div>
  );
}
