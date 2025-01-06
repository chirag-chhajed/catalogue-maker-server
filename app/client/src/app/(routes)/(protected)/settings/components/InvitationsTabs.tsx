import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Copy, UserPlus } from "lucide-react";
import {
  useCreateInvitationMutation,
  useGetInvitationsQuery,
} from "@/store/features/api/invitationApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function InvitationsTab() {
  const [role, setRole] = useState<"editor" | "viewer">("editor");
  const [create, { isLoading }] = useCreateInvitationMutation();
  const { data: invitations } = useGetInvitationsQuery();
  const handleGenerateInvitation = () => {
    toast.promise(create({ role }).unwrap(), {
      success: (res) => {
        navigator.clipboard.writeText(res.inviteCode);
        return "Created and Copied to Clipboard";
      },
      loading: "Creating invitation...",
      error: "Failed to create invitation",
    });
  };

  const handleCopyInviteCode = (inviteCode: string) => {
    navigator.clipboard.writeText(inviteCode);
  };

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-xl ">
        <CardHeader>
          <CardTitle className="text-2xl">Generate Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={role}
            onValueChange={setRole}
            className="flex space-x-4 mb-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="editor" id="editor" />
              <Label htmlFor="editor">Editor</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="viewer" id="viewer" />
              <Label htmlFor="viewer">Viewer</Label>
            </div>
          </RadioGroup>
          <Button
            disabled={isLoading}
            onClick={handleGenerateInvitation}
            className="w-full"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Generate Invitation
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Active Invitations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {invitations?.map((invitation) => (
              <Card
                key={invitation.id}
                className={cn(
                  "overflow-hidden",
                  invitation.expiresAt || invitation.status !== "active"
                    ? "opacity-50"
                    : ""
                )}
              >
                <CardContent className="p-0">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-[#bcd5dd] to-[#dcc4bc] text-white">
                    <Badge>{invitation.role}</Badge>
                    <Badge
                      variant={
                        invitation.status === "active"
                          ? "default"
                          : invitation.status === "accepted"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {invitation.status}
                    </Badge>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Invite Code
                      </p>
                      <p className="font-mono">{invitation.inviteCode}</p>
                    </div>
                    <Button
                      onClick={() =>
                        handleCopyInviteCode(invitation.inviteCode)
                      }
                      disabled={invitation.expiresAt}
                      className="w-full mt-2"
                      variant="outline"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Invite Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
