"use client";

import { Input } from "@/components/atoms/input";
import ClientsPage from "@/components/organisms/clients";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Download, Plus } from "lucide-react";

export default function Clients() {
  const router = useRouter();
  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Client Management",
          subtitle: {
            text: "Super Admin",
            className: "bg-purple-100 text-purple-700",
          },
          children: (
            <div className="flex items-center justify-between gap-4">
              <Input
                placeholder="Search by name or email"
                className="w-full max-w-[400px] bg-white"
              />
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  router.push("/clients/client");
                }}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add New Client</span>
              </Button>
              <Button className="bg-gray-100 hover:bg-gray-200">
                <Download className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-gray-700">Export CSV</span>
              </Button>
            </div>
          ),
        }}
      >
        <ClientsPage />
      </Dashboard>
    </ProtectedRoute>
  );
}
