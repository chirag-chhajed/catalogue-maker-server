"use client";

import { cn } from "@/lib/utils";
import { useRefreshQuery } from "@/store/features/api/authApi";
import { useOrganizationIdSelector } from "@/store/hooks";
import { Loader } from "lucide-react";
import React from "react";

// export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
//   size?: number;
//   className?: string;
// }
const LoadingSpinner = () => (
  <div className="min-h-screen flex justify-center items-center bg-gray-200/80">
    <Loader className="animate-spin " stroke="rgb(59 130 246)" size={36} />
  </div>
);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const organizationId = useOrganizationIdSelector();
  const { isLoading, isFetching } = useRefreshQuery({
    organizationId,
  });

  if (isLoading || isFetching) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
};

export default AuthProvider;
