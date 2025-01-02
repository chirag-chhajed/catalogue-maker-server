"use client";

import { useRefreshQuery } from "@/store/features/api/authApi";
import { useOrganizationIdSelector } from "@/store/hooks";
import { Loader } from "lucide-react";
import React from "react";

// export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
//   size?: number;
//   className?: string;
// }

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const organizationId = useOrganizationIdSelector();
  const { isLoading, isFetching } = useRefreshQuery({
    organizationId,
  });

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-200">
        {/* <LoaderCircleIcon size={48} className="text-blue-500 animate-spin" /> */}
        <Loader
          color="rgb(59 130 246 / var(--tw-text-opacity, 1))"
          className="animate-spin"
          size={48}
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
