"use client";

import { useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAppSelector((state) => state.hello);
  const router = useRouter();
  const pathname = usePathname();
  const isProtectedRoute = (path: string): boolean => {
    const protectedPattern = /^\/(?:organizations|catalogues)(?:\/.*)?$/;
    return protectedPattern.test(path);
  };
  // console.log(pathname);
  if (!accessToken && isProtectedRoute(pathname)) {
    router.replace("/");
  }

  return <>{children}</>;
};

export default ProtectedLayout;
