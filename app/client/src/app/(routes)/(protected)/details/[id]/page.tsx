import { use } from "react";
import { ItemCarousel } from "./components/ItemCarousel";

export default function CataloguePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ catalogueItemId: string }>;
}) {
  const routeParams = use(params);
  const querySearchParams = use(searchParams);
  return (
    <div className="container mx-auto px-4">
      <ItemCarousel
        id={routeParams.id}
        catalogueItemId={querySearchParams.catalogueItemId}
      />
    </div>
  );
}
