"use client";

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import type React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAppSelector((state) => state.hello);
  const router = useRouter();

  if (!accessToken) {
    router.replace("/");
  }

  return <>{children}</>;
};

export default ProtectedLayout;
