"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/store/features/api/authApi";
import { MoreVertical, Settings, HelpCircle, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function SettingsMenu() {
  const [logout] = useLogoutMutation();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={"/settings"}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500"
          onClick={() => {
            toast.promise(logout().unwrap(), {
              loading: "Logging out...",
              success: () => {
                localStorage.setItem("logout-event", Date.now().toString());
                return "Logged out";
              },
              error: "Failed to log out",
            });
          }}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
