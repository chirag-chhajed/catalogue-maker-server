"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteCatalogMutation } from "@/store/features/api/catalogueApi";
import { toast } from "sonner";

interface DeleteCatalogueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  catalogueId: string;
}

export default function DeleteCatalogueDialog({
  isOpen,
  onClose,
  catalogueId,
}: Readonly<DeleteCatalogueDialogProps>) {
  const [deleteCatalog] = useDeleteCatalogMutation();
  const handleDelete = async () => {
    // Implement delete catalogue functionality
    console.log("Deleting catalogue:", catalogueId);
    toast.promise(deleteCatalog({ id: catalogueId }).unwrap(), {
      loading: "Deleting...",
      success: () => {
        return "Catalogue deleted successfully";
      },
      error: "Failed to delete catalogue",
    });
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            catalogue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Yes, delete catalogue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
