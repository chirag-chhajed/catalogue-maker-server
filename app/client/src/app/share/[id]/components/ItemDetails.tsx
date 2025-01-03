import { Button } from "@/components/ui/button";
import { ImageType } from "@/store/features/api/catalogueApi";
import { Download, Share } from "lucide-react";

type ItemDetailsProps = {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    images: ImageType[];
  };
};

export function ItemDetails({ item }: ItemDetailsProps) {
  const handleShare = async () => {
    try {
      const files = await Promise.all(
        item.images.map(async (url) => {
          const response = await fetch(url.imageUrl);
          const blob = await response.blob();
          const fileName = url.imageUrl.split("/").pop() || "image.webp";
          return new File([blob], fileName, { type: blob.type });
        })
      );

      if (navigator.canShare?.({ files })) {
        await navigator.share({
          files,
        });
      }
    } catch (error) {
      console.log("Error sharing:", error);
    }
  };

  const handleDownload = async () => {
    const downloads = item.images.map(async (url) => {
      try {
        const response = await fetch(url.imageUrl);
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        const fileName = url.imageUrl.split("/").pop() || "image.jpg";
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error(`Failed to download ${url}:`, error);
      }
    });

    await Promise.all(downloads);
  };

  return (
    <div className="mt-4 flex flex-col flex-grow">
      <div className="flex justify-start space-x-4 mb-4">
        <Button
          className="bg-white rounded-full shadow"
          size={"icon"}
          onClick={handleShare}
        >
          <Share color="black" />
        </Button>
        <Button
          className="bg-white rounded-full shadow"
          size={"icon"}
          onClick={handleDownload}
        >
          <Download color="black" />
        </Button>
      </div>
      <h2 className="text-xl font-semibold">{item.name}</h2>
      <p className="text-gray-600 mt-2 font-mono">{item.description}</p>
      <p className="text-lg font-bold mt-2">₹{item.price.toLocaleString()}</p>
    </div>
  );
}
