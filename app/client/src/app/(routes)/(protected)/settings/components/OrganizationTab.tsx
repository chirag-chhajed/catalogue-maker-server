import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Check } from "lucide-react";
import { useGetOrgsQuery } from "@/store/features/api/organizationApi";
import { changeOrganizationId } from "@/store/features/organizationId";
import { store } from "@/store/store";
import { api } from "@/store/features/api";
import { useUserState } from "@/store/hooks";
import { cn } from "@/lib/utils";

export function OrganizationTab() {
  const { data: organizations } = useGetOrgsQuery();
  const user = useUserState();
  console.log(user);
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {organizations?.map((org) => (
        <Card
          onClick={() => {
            if (org.id !== user?.organizationId) {
              store.dispatch(api.util.resetApiState());
              store.dispatch(changeOrganizationId(org.id));
            }
          }}
          key={org.id}
          className={cn(
            "overflow-hidden cursor-pointer",
            org.id === user?.organizationId
              ? "ring-2 ring-stone-500 cursor-default"
              : ""
          )}
        >
          <CardHeader className="bg-gradient-to-r from-[#2e2906] to-[#f7ded5] text-white">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {org.name}
              </div>
              {org.id === user?.organizationId ? (
                <Check className="w-5 h-5" />
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <Badge
                className="w-fit"
                variant={org.role === "admin" ? "default" : "secondary"}
              >
                {org.role}
              </Badge>

              <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
                {org.description}
              </p>
              {org.id === user?.organizationId ? (
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  Current Organization
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
