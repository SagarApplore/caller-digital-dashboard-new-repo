"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import Dashboard from "@/components/templates/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { Plus, Users, Mail, User, Trash2, Edit, Loader2 } from "lucide-react";
import apiRequest from "@/utils/api";
import endpoints from "@/lib/endpoints";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  teamRole?: string;
  active: boolean;
  createdAt: string;
}

const TeamMembersPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fetch team members
  const fetchTeamMembers = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest("/users/team/members", "GET");
      setTeamMembers(response.data.data || []);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      toast.error("Failed to fetch team members");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous errors
    setFormErrors({
      name: "",
      email: "",
      password: "",
    });
    
    let hasErrors = false;
    const newErrors = {
      name: "",
      email: "",
      password: "",
    };
    
    // Validate all fields
    if (!formData.name) {
      newErrors.name = "Full name is required";
      hasErrors = true;
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
      hasErrors = true;
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
        hasErrors = true;
      }
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
      hasErrors = true;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      hasErrors = true;
    }
    
    // Update error state
    setFormErrors(newErrors);
    
    if (hasErrors) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest("/users/createTeamMember", "POST", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "TEAM_MEMBER",
      });

      if (response.data) {
        toast.success("Team member created successfully");
        setIsDialogOpen(false);
        setFormData({ name: "", email: "", password: "" });
        fetchTeamMembers(); // Refresh the list
      }
    } catch (error: any) {
      console.error("Error creating team member:", error);
      const errorMessage = error?.response?.data?.message || "Failed to create team member";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete team member
  const handleDelete = async (memberId: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) {
      return;
    }

    try {
      setIsLoading(true);
      await apiRequest(`/users/${memberId}`, "DELETE");
      toast.success("Team member deleted successfully");
      fetchTeamMembers(); // Refresh the list
    } catch (error: any) {
      console.error("Error deleting team member:", error);
      toast.error("Failed to delete team member");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Team Members",
          subtitle: {
            text: `${teamMembers.length} members`,
            className: "text-purple-700 font-semibold text-xs bg-purple-50 px-2 py-1 rounded-full",
          },
          children: (
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  // Reset form and errors when dialog is closed
                  setFormData({ name: "", email: "", password: "" });
                  setFormErrors({ name: "", email: "", password: "" });
                }
              }}>
              <DialogTrigger asChild>
                <Button className="bg-purple-700 hover:bg-purple-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter full name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (!e.target.value) {
                          setFormErrors({ ...formErrors, name: "Full name is required" });
                        } else {
                          setFormErrors({ ...formErrors, name: "" });
                        }
                      }}
                      className={formErrors.name ? "border-red-500" : ""}
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (!e.target.value) {
                          setFormErrors({ ...formErrors, email: "Email is required" });
                        } else {
                          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                          if (!emailRegex.test(e.target.value)) {
                            setFormErrors({ ...formErrors, email: "Please enter a valid email address" });
                          } else {
                            setFormErrors({ ...formErrors, email: "" });
                          }
                        }
                      }}
                      className={formErrors.email ? "border-red-500" : ""}
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (!e.target.value) {
                          setFormErrors({ ...formErrors, password: "Password is required" });
                        } else if (e.target.value.length < 6) {
                          setFormErrors({ ...formErrors, password: "Password must be at least 6 characters long" });
                        } else {
                          setFormErrors({ ...formErrors, password: "" });
                        }
                      }}
                      className={formErrors.password ? "border-red-500" : ""}
                    />
                    {formErrors.password && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button  className="bg-purple-700 hover:bg-purple-800" type="submit" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Team Member"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          ),
        }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your team by adding your first team member.
            </p>
            <Button  className="bg-purple-700 hover:bg-purple-800" onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => (
                    <TableRow key={member._id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{member.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {member.role === "TEAM_MEMBER" ? "Team Member" : member.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.active ? "default" : "destructive"}>
                          {member.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(member._id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </Dashboard>
    </ProtectedRoute>
  );
};

export default TeamMembersPage;
