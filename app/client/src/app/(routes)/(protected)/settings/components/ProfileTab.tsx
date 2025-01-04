import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Mail, User, Shield } from "lucide-react";
import { useUserState } from "@/store/hooks";
import { useLogoutMutation } from "@/store/features/api/authApi";
import { toast } from "sonner";

export function ProfileTab() {
  const user = useUserState();
  const [logout, { isLoading }] = useLogoutMutation();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center gap-4 pb-8">
        <div className="w-20 h-20">
          <span className="flex h-full w-full items-center text-lg justify-center rounded-full bg-muted">
            {user?.name[0]}
          </span>
        </div>
        <div>
          <CardTitle className="text-2xl">{user?.name}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.role === "admin"
              ? "Administrator"
              : user?.role === "editor"
                ? "Editor"
                : "Viewer"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <User className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Name
            </p>
            <p className="text-lg">{user?.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Mail className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Email
            </p>
            <p className="text-lg">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Shield className="w-5 h-5 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Role
            </p>
            <p className="text-lg">
              {user?.role === "admin"
                ? "Administrator"
                : user?.role === "editor"
                  ? "Editor"
                  : "Viewer"}
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            toast.promise(logout().unwrap(), {
              success: () => "Logged out successfully",
              error: () => "Failed to logout",
              loading: "Logging out...",
            });
          }}
          className=" mt-8"
          variant="destructive"
          size={"lg"}
          disabled={isLoading}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </CardContent>
    </Card>
  );
}
