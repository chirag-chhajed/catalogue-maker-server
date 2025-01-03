"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@/components/file-uploader";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useCreateCatalogItemMutation } from "@/store/features/api/catalogueApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
  images: z
    .array(z.instanceof(File))
    .min(1, "Select a minimum of 1 image")
    .max(5, "Images cannot exceed more then 5"),
});

type Schema = z.infer<typeof schema>;

export default function CreateItemForm({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  console.log(id);
  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: 1,
      images: [],
    },
  });
  const [create, { isLoading }] = useCreateCatalogItemMutation();
  const router = useRouter();
  async function onSubmit(data: Schema) {
    const formData = new FormData();
    for (const image of data.images) {
      formData.append("images", image);
    }
    formData.append("name", data.name);
    formData.append("description", data.description || "");
    formData.append("price", data.price);

    toast.promise(create({ id, formData }).unwrap(), {
      loading: "Creating Item...",
      success: () => {
        router.replace(`/catalogues/${id}`);
        return "Item created successfully";
      },
      error: "Failed to create Item",
    });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-2 text-gray-800 ">
          Create New Item
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
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
                  <FormLabel className="text-gray-700 font-semibold">
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
            <FormField
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">
                    Price
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
              name="images"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      Images
                    </FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFileCount={5}
                        maxSize={5 * 1024 * 1024}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                  {/* {uploadedFiles.length > 0 ? (
                <UploadedFilesCard uploadedFiles={uploadedFiles} />
              ) : null} */}
                </div>
              )}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-bold"
            >
              Create Item
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
