"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/atoms/input";
import ClientsPage from "@/components/organisms/clients";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import { AddClientForm } from "@/components/organisms/add-client-form";

export default function Clients() {
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setOpen(false);
    // Optionally refresh the clients list
    window.location.reload();
  };

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
              
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => setOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add New Client</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Client</DialogTitle>
                  </DialogHeader>
                  <AddClientForm
                    onSuccess={handleSuccess}
                    onCancel={() => setOpen(false)}
                  />
                </DialogContent>
              </Dialog>
              {/* <Button className="bg-gray-100 hover:bg-gray-200">
                <Download className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-gray-700">Export CSV</span>
              </Button> */}
            </div>
          ),
        }}
      >
        <ClientsPage />
      </Dashboard>
    </ProtectedRoute>
  );
}
