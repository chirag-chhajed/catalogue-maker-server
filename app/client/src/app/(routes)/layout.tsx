"use client";

import { useLogoutMutation } from "@/store/features/api/authApi";
import { clearState } from "@/store/features/hello";
import { clearOrganizationId } from "@/store/features/organizationId";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

const RouteLayout = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useAppSelector((state) => state.hello);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "logout-event") {
        console.log("Logout event received");
        dispatch(clearState());
        dispatch(clearOrganizationId());
        localStorage.removeItem("logout-event");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (accessToken && pathname === "/") {
    router.replace("/catalogues");
  }

  return <>{children}</>;
};

export default RouteLayout;

export const setupLocalStorageListener = () => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "logout-event") {
      console.log("Logout event received");
      localStorage.removeItem("logout-event");
    }
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
};
