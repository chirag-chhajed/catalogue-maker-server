import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useOrganitionIdDispatch } from "@/store/hooks";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  name: string;
  description: string;
  role: "admin" | "editor" | "viewer";
};

export default function OrganizationCard({
  organization,
}: Readonly<{
  organization: Organization;
}>) {
  const pastelColors = [
    "bg-pink-200",
    "bg-purple-200",
    "bg-indigo-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-yellow-200",
    "bg-red-200",
  ];
  const { changeOrganizationId } = useOrganitionIdDispatch();
  const randomColor =
    pastelColors[Math.floor(Math.random() * pastelColors.length)];
  const router = useRouter();
  const roleBadgeColor = {
    admin: "bg-red-100 text-red-800",
    editor: "bg-blue-100 text-blue-800",
    viewer: "bg-green-100 text-green-800",
  };

  return (
    <Card
      onClick={() => {
        changeOrganizationId(organization.id);
        router.replace("/catalogues");
      }}
      className="overflow-hidden cursor-pointer"
    >
      <div className={`${randomColor} h-32 flex items-center justify-center`} />
      <CardHeader>
        <CardTitle>{organization.name}</CardTitle>
        <CardDescription>{organization.description}</CardDescription>
      </CardHeader>

      <CardFooter className="justify-between">
        <Badge className={roleBadgeColor[organization.role]}>
          {organization.role}
        </Badge>
      </CardFooter>
    </Card>
  );
}
