"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash } from "lucide-react";
import EditCatalogueDialog from "./edit-catalogue-dialog";
import DeleteCatalogueDialog from "./delete-catalogue-dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Catalogue {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function CatalogueCard({
  catalogue,
}: Readonly<{ catalogue: Catalogue }>) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const router = useRouter();
  const pastelColors = [
    "bg-pink-200",
    "bg-purple-200",
    "bg-indigo-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-red-200",
  ];
  const randomColor =
    pastelColors[Math.floor(Math.random() * pastelColors.length)];

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  return (
    <Link href={`/catalogues/${catalogue.id}`} prefetch={false}>
      <Card
        // onClick={() => {
        //   router.push(`/catalogues/${catalogue.id}`);
        // }}
        className="overflow-hidden cursor-pointer"
      >
        <div className={`${randomColor} h-32`}></div>
        <CardHeader className="flex flex-row justify-between items-start">
          <CardTitle>{catalogue.name}</CardTitle>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent className="px-6 py-0">
          <p
            title={catalogue.description}
            className="text-sm text-gray-500 line-clamp-5"
          >
            {catalogue.description}
          </p>
        </CardContent>
        <CardFooter className="justify-between">
          <span className="text-sm text-gray-500">
            {new Date(catalogue.createdAt).toLocaleDateString()}
          </span>
        </CardFooter>
      </Card>
      <EditCatalogueDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        catalogue={catalogue}
      />
      <DeleteCatalogueDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        catalogueId={catalogue.id}
      />
    </Link>
  );
}
