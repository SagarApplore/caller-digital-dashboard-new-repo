"use client";

import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import IntegrationsPage from "@/components/organisms/integrations";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/atoms/input";
import { toast } from "sonner";
import apiRequest from "@/utils/api";

const Integrations = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sourceType, setSourceType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateIntegration = async () => {
    if (!sourceType) return toast.error("Enter source type");
    setLoading(true);

    // const res = await fetch("/api/integrations", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ sourceType }),
    // });
    try{
    const url=`/integrations`
    const res = await apiRequest(url,"POST",JSON.stringify({ sourceType }))

    setLoading(false);

   
      toast.success("Integration created successfully!");
      setSourceType("");
      setOpen(false);
      // optionally trigger refresh
      router.refresh?.();
    }
     catch(err) {
      toast.error("Failed to create integration");
    }
  };

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Integrations",
          subtitle: {
            text: "Centralize your lead sources",
            className: "bg-purple-100 text-purple-700",
          },
          children: (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-700 text-white hover:bg-purple-800 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Integration
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Integration</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <label className="text-sm font-medium">Source Type</label>
                  <Input
                    placeholder="e.g. zapier, crm, google_sheets"
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value)}
                  />
                  <Button
                    onClick={handleCreateIntegration}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? "Creating..." : "Create Integration"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          ),
        }}
      >
        <IntegrationsPage />
      </Dashboard>
    </ProtectedRoute>
  );
};

export default Integrations;
