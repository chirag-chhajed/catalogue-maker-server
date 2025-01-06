"use client";

import { useGetCatalogItemsQuery } from "@/store/features/api/catalogueApi";
import CatalogueItemCard from "./catalogue-item-card";
import EmptyState from "./empty-state";
import CatalogueItemListSkeleton from "./catalogue-item-list-skeleton";
import SettingsMenu from "../../components/settings-menu";
import SearchBar from "./search-bar";
import FilterSort from "./filter-sort";

const CatalogueItemList = ({ catalogueId }: { catalogueId: string }) => {
  const { data: catalogueItems, isLoading } = useGetCatalogItemsQuery(
    {
      id: catalogueId,
    },
    {
      skip: !catalogueId,
    }
  );

  if (isLoading) {
    return <CatalogueItemListSkeleton />;
  }
  if (catalogueItems?.items.length === 0) {
    return (
      <>
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {catalogueItems?.catalogueDetail.name}
          </h1>
          <SettingsMenu />
        </header>
        <EmptyState id={catalogueId} />
      </>
    );
  }
  return (
    <>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {catalogueItems?.catalogueDetail.name}
        </h1>
        <SettingsMenu />
      </header>
      <div className="flex justify-between items-center mb-6">
        {/* <SearchBar /> */}
        <FilterSort id={catalogueId} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogueItems?.items?.map((catalogue) => (
          <CatalogueItemCard
            key={catalogue.id}
            item={{
              id: catalogue.id,
              name: catalogue.name,
              description: catalogue.description,
              price: catalogue.price,
              imageUrl: catalogue.images[0].imageUrl,
              createdAt: catalogue.createdAt,
              catalogueId,
              blurDataURL: catalogue.images[0].blurhash,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default CatalogueItemList;
