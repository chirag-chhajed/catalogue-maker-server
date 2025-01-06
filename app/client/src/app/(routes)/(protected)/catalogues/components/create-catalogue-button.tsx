"use client";

import { Button } from "@/components/ui/button";
import { hasPermission } from "@/lib/role";
import { useUserState } from "@/store/hooks";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const CreateCatalogueButton = () => {
  const user = useUserState();
  if (!hasPermission(user?.role, "create:catalogue")) {
    return null;
  }
  return (
    <div className="fixed bottom-8 right-8">
      <Link href="/catalogues/create">
        <Button size="lg" className="rounded-full w-16 h-16">
          <PlusIcon className="w-8 h-8" />
        </Button>
      </Link>
    </div>
  );
};

export { CreateCatalogueButton };
