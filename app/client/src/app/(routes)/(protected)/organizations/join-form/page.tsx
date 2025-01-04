"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAcceptInviteMutation,
  useInviteStatusMutation,
} from "@/store/features/api/invitationApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { useState } from "react";

export default function JoinOrganizationPage() {
  const schema = z.object({
    inviteCode: z
      .string()
      .trim()
      .length(10, "Invite code must be 10 characters"),
  });
  type schemaInferType = z.infer<typeof schema>;
  const [inviteStatus, { isLoading, data: inviteDetails }] =
    useInviteStatusMutation();
  const [hello] = useAcceptInviteMutation();
  const [showDialog, setShowDialog] = useState(false);
  const form = useForm<schemaInferType>({
    resolver: zodResolver(schema),
    defaultValues: {
      inviteCode: "",
    },
    mode: "onBlur",
  });
  const handleSubmit = async (data: z.infer<typeof schema>) => {
    toast.promise(inviteStatus(data).unwrap(), {
      success: () => {
        setShowDialog(true);
        return "";
      },
      error: ({ data }) => {
        return data?.message ?? "Something went wrong";
      },
      loading: "Loading...",
    });
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Join an Organization</h1>
        <p className="mb-4 text-gray-600">
          Enter the invite code you received to join an organization.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="inviteCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} type="submit" className="w-full">
                Join Organization
              </Button>
            </div>
          </form>
        </Form>
        <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Join Organization</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to join {inviteDetails?.organizationName} as{" "}
                {inviteDetails?.role}?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  toast.promise(
                    hello({
                      joining: false,
                      inviteCode: inviteDetails?.inviteCode,
                    }),
                    {
                      loading: "Rejecting...",
                      success: () => {
                        return "Rejected";
                      },
                      error: () => "Failed to reject",
                    }
                  );
                }}
              >
                Reject
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  toast.promise(
                    hello({
                      joining: true,
                      inviteCode: inviteDetails?.inviteCode,
                    }),
                    {
                      loading: "Accepting...",
                      success: () => {
                        return "Accepted";
                      },
                      error: () => "Failed to Accept",
                    }
                  );
                }}
              >
                Accept
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
