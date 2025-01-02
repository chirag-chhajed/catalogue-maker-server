"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUpdateCatalogItemMutation } from "@/store/features/api/catalogueApi";
import { toast } from "sonner";

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name must be minimum of 1 character")
    .max(100, "Name must be maximum of 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be maximum of 500 characters")
    .optional(),
  price: z.coerce
    .number({ message: "Enter a valid price" })
    .positive("Price must be greater than 0")
    .multipleOf(0.01, "Price can only have up to 2 decimal places")
    .min(0.01, "Minimum price is 0.01"),
});

interface CatalogueItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  createdAt: string;
  catalogueId: string;
}

interface UpdateCatalogueItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: CatalogueItem;
}

export default function UpdateCatalogueItemDialog({
  isOpen,
  onClose,
  item,
}: UpdateCatalogueItemDialogProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: item.name,
      description: item.description,
      price: item.price,
    },
  });

  const [updateCatalog, { isLoading }] = useUpdateCatalogItemMutation();

  const onSubmit = (values: z.infer<typeof schema>) => {
    // Implement update catalogue item functionality
    toast.promise(
      updateCatalog({
        id: item.id,
        catalogueId: item.catalogueId,
        ...values,
      }).unwrap(),
      {
        success: () => {
          onClose();
          return "Item updated successfully";
        },
        error: "Failed to update Item",
        loading: "Updating Item...",
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Catalogue Item</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button size={"lg"} type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
