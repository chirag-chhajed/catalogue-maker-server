import Link from "next/link";
import OrganizationList from "./components/organization-list";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export default function OrganizationsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Organizations</h1>

        <OrganizationList />
      </main>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 flex flex-col gap-4 items-center pb-4">
        <Link href="/organizations/create">
          <Button size="lg" className="rounded-full w-16 h-16">
            <PlusIcon className="w-8 h-8" />
          </Button>
        </Link>
        <Link
          href="/organizations/join-form"
          className="text-blue-600 hover:underline text-center"
        >
          Have an invite code to join an organization?
        </Link>
      </div>
    </div>
  );
}
