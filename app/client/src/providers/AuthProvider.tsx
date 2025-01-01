"use client";

import { useRefreshQuery } from "@/store/features/api/authApi";
import { useOrganizationIdSelector } from "@/store/hooks";
import React, { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const organizationId = useOrganizationIdSelector();
  const [shouldFetch, setShouldFetch] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldFetch(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [organizationId]);
  const { isLoading, isFetching } = useRefreshQuery(
    {
      organizationId,
    },
    {
      skip: !shouldFetch,
    }
  );

  if (isLoading || isFetching) {
    return null;
  }
  return <>{children}</>;
};

export default AuthProvider;
