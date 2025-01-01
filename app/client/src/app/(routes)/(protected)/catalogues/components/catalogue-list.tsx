"use client";

import { useGetCatalogQuery } from "@/store/features/api/catalogueApi";
import CatalogueCard from "./catalogue-card";
import EmptyState from "./empty-state";
import CatalogueCardSkeleton from "./catalogue-card-skeleton";

export default function CatalogueList() {
  const { data: catalogues, isLoading } = useGetCatalogQuery();

  if (isLoading) {
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <CatalogueCardSkeleton key={index} />
      ))}
    </div>;
  }

  if (catalogues?.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {catalogues?.map((catalogue) => (
        <CatalogueCard key={catalogue.id} catalogue={catalogue} />
      ))}
    </div>
  );
}
