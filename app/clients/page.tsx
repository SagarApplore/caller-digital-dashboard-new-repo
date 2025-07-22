"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/atoms/input";
import ClientsPage from "@/components/organisms/clients";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";
import apiRequest from "@/utils/api";

export default function Clients() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CLIENT_ADMIN");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [name, setName] = useState("");

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await apiRequest("/users/create", "POST", {
        name,
        email,
        password,
        role,
      });
      setSuccess("Client created successfully!");
      setName("");
      setEmail("");
      setPassword("");
      setRole("CLIENT_ADMIN");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create client");
    } finally {
      setLoading(false);
    }
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
              <Input
                placeholder="Search by name or email"
                className="w-full max-w-[400px] bg-white"
              />
              {/* Old navigation logic, keep for later: */}
              {/* <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  router.push("/clients/client");
                }}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add New Client</span>
              </Button> */}
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Test Client</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new client (test modal)
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateClient} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        placeholder="Client Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Email</label>
                      <Input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        placeholder="client@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        placeholder="Password"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Role</label>
                      <select
                        className="border rounded px-3 py-2 w-full"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        required
                      >
                        <option value="CLIENT_ADMIN">CLIENT_ADMIN</option>
                        <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      </select>
                    </div>
                    {error && <div className="text-red-600 text-sm">{error}</div>}
                    {success && <div className="text-green-600 text-sm">{success}</div>}
                    <DialogFooter>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={loading}>
                        {loading ? "Creating..." : "Create Client"}
                      </Button>
                      <DialogClose asChild>
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
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
