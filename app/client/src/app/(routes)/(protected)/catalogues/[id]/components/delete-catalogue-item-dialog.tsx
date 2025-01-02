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
import { useDeleteCatalogItemMutation } from "@/store/features/api/catalogueApi";
import { toast } from "sonner";

interface DeleteCatalogueItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export default function DeleteCatalogueItemDialog({
  isOpen,
  onClose,
  itemId,
}: DeleteCatalogueItemDialogProps) {
  const [deleteItem] = useDeleteCatalogItemMutation();
  const handleDelete = () => {
    // Implement delete catalogue item functionality
    toast.promise(
      deleteItem({
        id: itemId,
      }).unwrap(),
      {
        loading: "Deleting...",
        success: () => {
          onClose();
          return "Item deleted successfully";
        },
        error: "Failed to delete Item",
      }
    );
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            catalogue item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Yes, delete item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
