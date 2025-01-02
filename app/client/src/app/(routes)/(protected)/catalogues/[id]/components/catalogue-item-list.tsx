"use client";

import { useGetCatalogItemsQuery } from "@/store/features/api/catalogueApi";
import CatalogueItemCard from "./catalogue-item-card";
import EmptyState from "./empty-state";
import CatalogueItemListSkeleton from "./catalogue-item-list-skeleton";

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
    return <EmptyState />;
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          }}
        />
      ))}
    </div>
  );
};

export default CatalogueItemList;
