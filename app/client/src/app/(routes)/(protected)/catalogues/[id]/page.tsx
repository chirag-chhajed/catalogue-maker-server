"use client";

import Link from "next/link";
import CatalogueItemList from "./components/catalogue-item-list";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { use } from "react";
import { hasPermission } from "@/lib/role";
import { useUserState } from "@/store/hooks";

const CatalogueDetailPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = use(params);
  const user = useUserState();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <CatalogueItemList catalogueId={id} />
      </main>
      {hasPermission(user?.role, "create:catalogue") ? (
        <div className="fixed bottom-8 right-8">
          <Link href={`/catalogues/${id}/create`}>
            <Button size="lg" className="rounded-full w-16 h-16">
              <PlusIcon className="w-8 h-8" />
            </Button>
          </Link>
        </div>
      ) : null}
    </div>
  );
};

export default CatalogueDetailPage;
