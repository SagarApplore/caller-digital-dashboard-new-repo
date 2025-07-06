import TeamMembers from "@/components/organisms/team-members";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Button } from "@/components/ui/button";
import { Download, UserPlus } from "lucide-react";

export default function TeamMembersPage() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Team Members",
          subtitle: {
            text: "14 members",
            className: "text-purple-700 bg-purple-100",
          },
          children: (
            <div className="flex items-center gap-2">
              <Button className="bg-purple-700 text-white">
                <UserPlus className="w-4 h-4" />
                Add Team Member
              </Button>
              <Button className="bg-gray-100 text-gray-700">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          ),
        }}
      >
        <TeamMembers />
      </Dashboard>
    </ProtectedRoute>
  );
}
