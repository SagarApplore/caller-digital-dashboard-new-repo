"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Card, CardContent } from "@/components/organisms/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  Instagram,
  Facebook,
  Circle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import utils from "@/utils/index.util";
import { useState } from "react";
import { useEffect } from "react";
import apiRequest from "@/utils/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { EditClientForm } from "./edit-client-form";

const getPlanColor = (plan: string) => {
  switch (plan) {
    case "Basic":
      return "bg-green-200 text-green-700";
    case "Professional":
      return "bg-cyan-200 text-cyan-700";
    case "Enterprise":
      return "bg-purple-200 text-purple-700";
    default:
      return "bg-gray-500 text-white";
  }
};

const getChannelIconAndColor = (channel: string) => {
  switch (channel.toLowerCase()) {
    case "email":
      return {
        icon: <Mail className="w-4 h-4" />,
        color: "bg-blue-200 text-blue-700",
      };
    case "whatsapp":
      return {
        icon: <Phone className="w-4 h-4" />,
        color: "bg-green-200 text-green-700",
      };
    case "sms":
      return {
        icon: <MessageSquare className="w-4 h-4" />,
        color: "bg-red-200 text-red-700",
      };
    case "instagram":
      return {
        icon: <Instagram className="w-4 h-4" />,
        color: "bg-purple-200 text-purple-700",
      };
    case "facebook":
      return {
        icon: <Facebook className="w-4 h-4" />,
        color: "bg-orange-200 text-orange-700",
      };
    default:
      return {
        icon: <Mail className="w-4 h-4" />,
        color: "bg-gray-200 text-gray-700",
      };
  }
};

const getHealthColor = (health: number) => {
  if (health >= 90) {
    return "text-green-700";
  } else if (health >= 70) {
    return "text-yellow-700";
  } else if (health >= 50) {
    return "text-orange-700";
  } else if (health >= 30) {
    return "text-red-700";
  } else {
    return "text-gray-700";
  }
};

const getIndustryColor = (industry: string) => {
  if (industry === "BFSI") {
    return "text-blue-700 bg-blue-100";
  } else if (industry === "D2C") {
    return "text-green-700 bg-green-100";
  } else {
    return "text-gray-700 bg-gray-100";
  }
};

const getCreditStatusColor = (usedCredits: number, totalCredits: number) => {
  if (!totalCredits) return "text-gray-500";
  
  const usagePercentage = (usedCredits / totalCredits) * 100;
  
  if (usagePercentage >= 90) {
    return "text-red-600";
  } else if (usagePercentage >= 70) {
    return "text-orange-600";
  } else if (usagePercentage >= 50) {
    return "text-yellow-600";
  } else {
    return "text-green-600";
  }
};

export function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest("/users/getClients", "GET");
        console.log(response.data);
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
        toast({
          title: "Error",
          description: "Failed to fetch clients",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, [toast]);

  const handleDeleteClient = async (clientId: string) => {
    setDeletingClientId(clientId);
    try {
      const response = await apiRequest(`/users/deactivate/${clientId}`, "PUT");
      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Client deactivated successfully",
        });
        // Refresh the clients list
        const updatedResponse = await apiRequest("/users/getClients", "GET");
        if (updatedResponse.data?.success) {
          setClients(updatedResponse.data.data);
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate client",
        variant: "destructive",
      });
    } finally {
      setDeletingClientId(null);
    }
  };

  const handleEditClient = (clientId: string) => {
    setEditingClientId(clientId);
  };

  const handleEditSuccess = async () => {
    setEditingClientId(null);
    toast({
      title: "Success",
      description: "Client updated successfully",
    });
    // Refresh the clients list
    const response = await apiRequest("/users/getClients", "GET");
    if (response.data?.success) {
      setClients(response.data.data);
    }
  };

  const handleEditCancel = () => {
    setEditingClientId(null);
  };

  return (
    <div className="">
      {/* Filters */}
      <Card className="border-none rounded-none px-4 pb-4 pt-2">
        <CardContent className="p-0">
          <div className="flex items-center space-x-4">
            <Select defaultValue="all">
              <SelectTrigger className="w-40 bg-gray-50">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-plans">
              <SelectTrigger className="w-40 bg-gray-50">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-plans">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <div className="p-4 max-h-[calc(100vh-140px)] overflow-y-scroll">
        <div className="rounded-lg shadow-lg shadow-gray-200">
          <Table className="border-none">
            <TableHeader className="bg-gray-100">
              <TableRow className="border-gray-100">
                <TableHead>Company</TableHead>
                <TableHead>Assistants</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Credits Used</TableHead>
                <TableHead>Credits Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {clients.map((client) => (
                <TableRow
                  key={client._id}
                  className="hover:bg-gray-50 border-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                          {client.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {client.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{client.email}</span>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {client.assistant?.length || 0}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {["email", "whatsapp", "sms"].map((channel, idx) => {
                        const { icon, color } = getChannelIconAndColor(channel);
                        return (
                          <div
                            key={channel + idx}
                            className={`flex items-center ${color} rounded-full px-2 py-2`}
                          >
                            {icon}
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className={`font-medium ${getCreditStatusColor(client.usedCredits || 0, client.totalCredits || 0)}`}>
                        {client.usedCredits?.toLocaleString() || 0}
                      </div>
                      {client.totalCredits && (
                        <div className="text-xs text-gray-500">
                          {client.totalCredits > 0 
                            ? `${((client.usedCredits || 0) / client.totalCredits * 100).toFixed(1)}% used`
                            : 'No credits allocated'
                          }
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {client.remainingCredits?.toLocaleString() || 0}
                      </div>
                      {client.totalCredits && (
                        <div className="text-xs text-gray-500">
                          of {client.totalCredits.toLocaleString()} total
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-xs w-fit font-semibold flex items-center gap-1 rounded-full px-2 py-1 ${utils.colors.getStatusColor(
                        client.active
                      )}`}
                    >
                      <Circle
                        className="w-2 h-2"
                        fill="currentColor"
                        stroke="currentColor"
                      />
                      {typeof client.active === "boolean"
                        ? client.active
                          ? "Active"
                          : "Inactive"
                        : client.active}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditClient(client._id)}
                      >
                        Edit
                      </Button>
                      {client.active && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              disabled={deletingClientId === client._id}
                            >
                              {deletingClientId === client._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                Deactivate Client
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to deactivate{" "}
                                <strong>{client.name}</strong>? This action will:
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                  <li>Set the client as inactive</li>
                                  <li>Deactivate all associated team members</li>
                                  <li>This action can be reversed by an administrator</li>
                                </ul>
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteClient(client._id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Deactivate Client
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Edit Client Form Modal */}
      {editingClientId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Client</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditCancel}
                >
                  ✕
                </Button>
              </div>
              <EditClientForm
                clientId={editingClientId}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
