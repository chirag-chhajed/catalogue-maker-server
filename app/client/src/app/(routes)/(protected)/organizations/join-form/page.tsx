import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function JoinOrganizationPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Join an Organization</h1>
        <p className="mb-4 text-gray-600">
          Enter the invite code you received to join an organization.
        </p>
        <form>
          <div className="space-y-4">
            <div>
              <Label htmlFor="inviteCode">Invite Code</Label>
              <Input id="inviteCode" name="inviteCode" required />
            </div>
            <Button type="submit" className="w-full">
              Join Organization
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
