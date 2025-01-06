import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrganitionIdDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Organization = {
  id: string;
  name: string;
  description: string;
  role: "admin" | "editor" | "viewer";
};

export default function OrganizationCard({
  org,
}: Readonly<{
  org: Organization;
}>) {
  const { changeOrganizationId } = useOrganitionIdDispatch();

  const router = useRouter();
  const roleBadgeColor = {
    admin: "bg-red-100 text-red-800",
    editor: "bg-blue-100 text-blue-800",
    viewer: "bg-green-100 text-green-800",
  };
  return (
    <Card
      onClick={() => {
        changeOrganizationId(org.id);
        router.replace("/catalogues");
      }}
      className="overflow-hidden cursor-pointer"
    >
      <CardHeader className="bg-gradient-to-r from-[#2e2906] to-[#f7ded5] text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {org.name}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          <Badge className={cn("w-fit", roleBadgeColor[org.role])}>
            {org.role}
          </Badge>

          <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">
            {org.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
