"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import UpdateCatalogueItemDialog from "./update-catalogue-item-dialog";
import DeleteCatalogueItemDialog from "./delete-catalogue-item-dialog";

interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
}

export default function CatalogueItemCard({ item }: { item: CatalogueItem }) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={item.imageUrl}
              alt={item.name}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <div className="absolute top-2 right-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="bg-white rounded-full p-2">
                <MoreVertical className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Update
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
          <p className="font-bold text-lg">${item.price}</p>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          {new Date(item.createdAt).toLocaleDateString()}
        </CardFooter>
      </Card>
      <UpdateCatalogueItemDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        item={item}
      />
      <DeleteCatalogueItemDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        itemId={item.id}
      />
    </>
  );
}
