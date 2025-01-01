"use client";

import { useAppSelector, useOrganizationIdSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import type React from "react";

const CataloguesLayout = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAppSelector((state) => state.hello);
  const organizationId = useOrganizationIdSelector();
  const router = useRouter();

  if (accessToken && !organizationId) {
    router.replace("/organizations");
  }
  return <>{children}</>;
};

export default CataloguesLayout;
