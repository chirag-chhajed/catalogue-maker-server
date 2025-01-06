"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useCreateCatalogMutation } from "@/store/features/api/catalogueApi";
import { useRouter } from "next/navigation";
import { useUserState } from "@/store/hooks";
import { hasPermission } from "@/lib/role";

export default function CreateOrganizationPage() {
  const user = useUserState();
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
  const [create, { isLoading }] = useCreateCatalogMutation();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
    },
    mode: "onBlur",
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    toast.promise(create(data).unwrap(), {
      loading: "Creating Catalogue...",
      success: () => {
        router.push("/catalogues");
        return "Catalogue created successfully";
      },
      error: "Failed to create Catalogue",
    });
  };

  if (!hasPermission(user?.role, "create:catalogue")) {
    return (
      <div>
        <h1>Unauthorized</h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-gray-800">
          Create New Catalogue
        </h1>
        <p className="text-gray-600 mb-2">
          Enter details for your new Catalogue
        </p>

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
                      <Input placeholder="Enter Catalogue name" {...field} />
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
                      <Textarea
                        placeholder="Enter Catalogue description"
                        {...field}
                      />
                    </FormControl>
                    {fieldState.error?.message ? (
                      <FormMessage>{fieldState.error?.message}</FormMessage>
                    ) : null}
                  </FormItem>
                )}
              />

              <Button
                disabled={isLoading}
                type="submit"
                className="w-full font-bold"
              >
                Create Catalogue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
