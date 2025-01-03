"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageCarousel } from "./ImageCarousel";
import { ItemDetails } from "./ItemDetails";
import { useGetCatalogItemsQuery } from "@/store/features/api/catalogueApi";
import { useEffect, useState } from "react";
import { parseAsString, useQueryState } from "nuqs";

export function ItemCarousel({
  id,
  catalogueItemId,
}: {
  id: string;
  catalogueItemId: string;
}) {
  const { data, isLoading } = useGetCatalogItemsQuery(
    {
      id,
    },
    {
      skip: !id,
    }
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [, setCount] = useState(0);
  const [hello, setHello] = useQueryState(
    "catalogueItemId",
    parseAsString.withDefault(catalogueItemId)
  );
  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    if (!hello) {
      return;
    }
    const index = data?.items.findIndex((item) => item.id === hello);
    api?.scrollTo(index);
  }, [api]);

  useEffect(() => {
    if (!data?.items) {
      return;
    }

    setCurrent(data?.items[current - 1]?.id);
  }, []);

  useEffect(() => {
    if (!api || !data?.items) {
      return;
    }

    api.on("select", () => {
      const currentIndex = api.selectedScrollSnap();

      setHello(data?.items[currentIndex].id);
    });
  }, [api, data?.items, setHello]);
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{data?.catalogueDetail?.name}</h1>
      <Carousel setApi={setApi} className="w-full min-h-screen">
        <CarouselContent>
          {data?.items?.map((item) => (
            <CarouselItem key={item.id}>
              <div className="flex flex-col ">
                <ImageCarousel images={item.images} />
                <ItemDetails item={item} id={id} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="absolute bottom-1/4 left-0 right-0 flex justify-between space-x-4">
          <CarouselPrevious className="relative left-0 translate-y-0" />
          <CarouselNext className="relative right-0 translate-y-0" />
        </div>
      </Carousel>
    </>
  );
}
