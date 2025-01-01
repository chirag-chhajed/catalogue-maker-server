"use client";

import OrganizationCard from "./organization-card";
import EmptyState from "./empty-state";
import { useGetOrgsQuery } from "@/store/features/api/organizationApi";
import OrganizationCardSkeleton from "./organization-card-skeleton";

export default function OrganizationList() {
  const { data: organizations, isLoading } = useGetOrgsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <OrganizationCardSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (organizations?.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {organizations?.map((org) => (
        <OrganizationCard key={org.id} organization={org} />
      ))}
    </div>
  );
}
