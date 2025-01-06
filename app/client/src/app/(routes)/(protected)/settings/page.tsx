"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./components/ProfileTab";
import { OrganizationTab } from "./components/OrganizationTab";
import { InvitationsTab } from "./components/InvitationsTabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserState } from "@/store/hooks";
import { hasPermission } from "@/lib/role";

export default function SettingsPage() {
  const router = useRouter();
  const user = useUserState();
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/catalogues");
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-100">
          Settings
        </h1>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full gap-1 grid-cols-3 rounded-lg bg-gray-200  dark:bg-gray-700 h-fit">
            <TabsTrigger
              value="profile"
              className="rounded-md py-2 text-sm font-medium transition-colors hover:bg-white hover:text-gray-900  data-[state=active]:bg-white data-[state=active]:text-gray-900 "
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="organization"
              className="rounded-md py-2 text-sm font-medium transition-colors hover:bg-white hover:text-gray-900  data-[state=active]:bg-white data-[state=active]:text-gray-900 "
            >
              Organization
            </TabsTrigger>
            <TabsTrigger
              value="invitations"
              className="rounded-md py-2 text-sm font-medium transition-colors hover:bg-white hover:text-gray-900  data-[state=active]:bg-white data-[state=active]:text-gray-900 "
            >
              Invitations
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="organization" className="mt-6">
            <OrganizationTab />
          </TabsContent>
          {hasPermission(user?.role, "invite:user") ? (
            <TabsContent value="invitations" className="mt-6">
              <InvitationsTab />
            </TabsContent>
          ) : null}
        </Tabs>
      </div>
    </div>
  );
}
