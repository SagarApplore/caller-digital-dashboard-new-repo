import { Input } from "@/components/atoms/input";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Button } from "@/components/ui/button";
import { LLMConfigPage } from "@/pages/llm-config";
import { Plus } from "lucide-react";

export default function LLMProviderConfigPage() {
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "LLM Provider Configuration",
          subtitle: {
            text: "Super Admin",
            className: "text-red-700 bg-red-100",
          },
          children: (
            <div className="flex items-center gap-2">
              <Input
                type="text"
                placeholder="Search clients, assistants, models"
              />
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4" />
                Add Provider
              </Button>
            </div>
          ),
        }}
      >
        <LLMConfigPage />
      </Dashboard>
    </ProtectedRoute>
  );
}
