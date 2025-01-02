"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdateCatalogMutation } from "@/store/features/api/catalogueApi";
interface Catalogue {
  id: string;
  name: string;
  description: string;
}

interface EditCatalogueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  catalogue: Catalogue;
}

export default function EditCatalogueDialog({
  isOpen,
  onClose,
  catalogue,
}: Readonly<EditCatalogueDialogProps>) {
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
  });
  type FormValues = z.infer<typeof schema>;
  const [create, { isLoading }] = useUpdateCatalogMutation();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: catalogue.name,
      description: catalogue.description,
    },
    mode: "onBlur",
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    toast.promise(create({ ...data, id: catalogue.id }).unwrap(), {
      loading: "Updating Catalogue...",
      success: () => {
        router.push("/catalogues");
        onClose();
        return "Catalogue updated successfully";
      },
      error: "Failed to update Catalogue",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Catalogue</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    {fieldState.error?.message ? (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    {fieldState.error?.message ? (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="mt-6">
              <Button disabled={isLoading} type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
