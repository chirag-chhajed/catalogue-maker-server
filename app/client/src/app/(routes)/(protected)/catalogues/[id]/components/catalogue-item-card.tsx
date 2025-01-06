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
import Link from "next/link";
import { useUserState } from "@/store/hooks";
import { hasPermission } from "@/lib/role";
import { format } from "date-fns";
interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  catalogueId: string;
  blurDataURL: string;
}

export default function CatalogueItemCard({ item }: { item: CatalogueItem }) {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const user = useUserState();
  return (
    <>
      <Card className="overflow-hidden relative">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={item.imageUrl}
              alt={item.name}
              className="object-contain"
              placeholder={"blur"}
              blurDataURL={item.blurDataURL}
              fill
              draggable={false}
            />
          </div>
          {hasPermission(user?.role, "update:catalogue") ? (
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
                  {hasPermission(user?.role, "delete:catalogue") ? (
                    <DropdownMenuItem
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  ) : null}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : null}
        </CardHeader>
        <CardContent className="p-4">
          <Link
            href={`/details/${item.catalogueId}?catalogueItemId=${item.id}`}
            prefetch={false}
          >
            <h3 className="font-semibold text-lg mb-2 underline">
              {item.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mb-2">{item.description}</p>
          <p className="font-bold text-lg"> ₹{item.price.toLocaleString()}</p>
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          {format(new Date(item.createdAt), "dd/MM/yyyy")}
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
