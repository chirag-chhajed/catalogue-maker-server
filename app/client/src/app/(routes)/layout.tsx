"use client";

import { useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAppSelector((state) => state.hello);
  const router = useRouter();
  const pathname = usePathname();
  if (accessToken && pathname === "/") {
    router.replace("/catalogues");
  }

  return <>{children}</>;
};

export default RouteLayout;
