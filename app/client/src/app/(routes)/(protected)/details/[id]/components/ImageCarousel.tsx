"use client";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Share } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type ImageType = {
  imageUrl: string;
  blurhash: string | null;
  id: string;
};

type ImageCarouselProps = {
  images: ImageType[];
};

export function ImageCarousel({ images }: ImageCarouselProps) {
  const handleShare = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], "image.jpg", { type: blob.type });

      if (navigator?.canShare?.({ files: [file] })) {
        await navigator?.share({
          files: [file],
          title: "Check out this image!",
          text: "Cool image I wanted to share",
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = imageUrl.split("/").pop() || "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading:", error);
    }
  };

  // const handleCopyLink = async () => {
  //   try {
  //     await navigator.clipboard.writeText(
  //       `${location.origin}/share/${id}?catalogueItemId=${item.id}`
  //     );
  //     // Add toast notification here
  //   } catch (error) {
  //     console.error("Error copying link:", error);
  //   }
  // };

  return (
    <Carousel orientation="vertical" className="bg-black/50">
      <CarouselContent className="size-[300px] md:size-[500px] mx-auto ">
        {images.map((image, index) => (
          <CarouselItem
            className="flex items-center justify-center py-2"
            key={image.id}
          >
            <Dialog>
              <DialogOverlay className="bg-black" />
              <DialogTrigger>
                <Image
                  src={image.imageUrl}
                  alt={`Product image ${index + 1}`}
                  width={300}
                  height={300}
                  sizes="100vw"
                  className="object-contain cursor-pointer md:size-[400px]"
                />
              </DialogTrigger>
              <DialogContent className="max-w-7xl border-0 bg-transparent p-0">
                <DialogTitle className="sr-only">
                  Modal for Product Image {index + 1}
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Modal for Product Image {index + 1}
                </DialogDescription>
                <div className="relative h-[calc(100vh-220px)] w-full overflow-clip rounded-md bg-transparent ">
                  <Image
                    src={image.imageUrl}
                    fill
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleShare(image.imageUrl)}
                    disabled={!navigator.share}
                    className="rounded-full"
                  >
                    <Share className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleDownload(image.imageUrl)}
                    className="rounded-full"
                  >
                    <Download className="h-4 w-4" />
                  </Button>

                  {/* <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => {
                      toast.promise(handleCopyLink, {
                        loading: "Copying link...",
                        success: "Link copied!",
                        error: "Error copying link",
                      });
                    }}
                    className="rounded-full"
                  >
                    <Link className="h-4 w-4" />
                  </Button> */}
                </div>
              </DialogContent>
            </Dialog>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
