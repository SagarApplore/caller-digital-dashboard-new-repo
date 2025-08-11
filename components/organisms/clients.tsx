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
import { useState, useEffect } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import endpoints from "@/lib/endpoints";

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>("all"); // "all", "active", "inactive"

  // Calculate pagination info
  const pagination = {
    currentPage,
    totalPages,
    totalCount,
    limit: pageSize,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };

  const fetchClients = async (page: number, limit: number, status = statusFilter) => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      });
      
      // Add status filter if not "all"
      if (status !== "all") {
        params.append("status", status);
        console.log(`Adding status filter: ${status}`);
      } else {
        console.log(`No status filter added (status is: ${status})`);
      }
      
      const queryString = params.toString();
      console.log(`Final query string: ${queryString}`);
      
      // Add pagination parameters to the API call
      const response = await apiRequest(`/users/getClients?${queryString}`, "GET");
      console.log(`=== FETCH CLIENTS ===`);
      console.log(`Requested: page=${page}, limit=${limit}, status=${status}`);
      console.log(`Query string: ${queryString}`);
      console.log(`Response status:`, response.status);
      console.log(`Response data:`, response.data);
      
      // Handle the new response structure with pagination
      if (response.data?.success && response.data?.data) {
        const clientsData = response.data.data;
        const paginationData = response.data.pagination;
        
        console.log(`=== PAGINATION INFO ===`);
        console.log("Pagination data:", paginationData);
        console.log(`Received ${clientsData.length} clients`);
        
        // Check for duplicate IDs
        const clientIds = clientsData.map((client: any) => client._id);
        const uniqueIds = new Set(clientIds);
        if (clientIds.length !== uniqueIds.size) {
          console.warn(`⚠️ DUPLICATE IDs DETECTED!`);
          console.warn(`Total clients: ${clientsData.length}, Unique IDs: ${uniqueIds.size}`);
          const duplicates = clientIds.filter((id: string, index: number) => clientIds.indexOf(id) !== index);
          console.warn(`Duplicate IDs:`, duplicates);
        }
        
        setClients(clientsData);
        setTotalCount(paginationData.totalCount);
        setTotalPages(paginationData.totalPages);
        
        // Debug: Log client data structure
        console.log("=== CLIENT DATA ===");
        console.log("Processed clients data:", clientsData.map((client: any) => ({
          id: client._id,
          name: client.name,
          active: client.active,
          activeType: typeof client.active,
          email: client.email,
          role: client.role
        })));
      } else {
        console.warn("⚠️ Using fallback response format");
        // Fallback for old response format
        let clientsData = [];
        if (Array.isArray(response.data)) {
          clientsData = response.data;
          setTotalCount(response.data.length);
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          clientsData = response.data.data;
          setTotalCount(response.data.data.length);
        } else {
          clientsData = [];
          setTotalCount(0);
        }

        // Apply pagination on frontend as fallback
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedClients = clientsData.slice(startIndex, endIndex);
        
        setClients(paginatedClients);
        setTotalPages(Math.ceil(clientsData.length / limit));
      }
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

  // Fetch clients on component mount only
  useEffect(() => {
    fetchClients(currentPage, pageSize, statusFilter);
  }, []); // Remove currentPage and pageSize dependencies

  const handlePageChange = async (page: number) => {
    try {
      console.log(`=== PAGE CHANGE ===`);
      console.log(`Current state - page: ${currentPage}, pageSize: ${pageSize}`);
      console.log(`Requesting page: ${page}`);
      setIsPageLoading(true);
      setCurrentPage(page);
      // Pass the new page number directly to fetchClients
      await fetchClients(page, pageSize, statusFilter);
      console.log(`=== PAGE CHANGE COMPLETE ===`);
    } catch (error) {
      console.error("Error changing page:", error);
      toast({
        title: "Error",
        description: "Failed to load page",
        variant: "destructive",
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  const handlePageSizeChange = async (newPageSize: number) => {
    try {
      console.log(`=== PAGE SIZE CHANGE ===`);
      console.log(`Current state - page: ${currentPage}, pageSize: ${pageSize}`);
      console.log(`Requesting pageSize: ${newPageSize}`);
      setIsPageLoading(true);
      setPageSize(newPageSize);
      setCurrentPage(1); // Reset to first page when changing page size
      // Pass the new page size directly to fetchClients
      await fetchClients(1, newPageSize, statusFilter);
      console.log(`=== PAGE SIZE CHANGE COMPLETE ===`);
    } catch (error) {
      console.error("Error changing page size:", error);
      toast({
        title: "Error",
        description: "Failed to change page size",
        variant: "destructive",
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleStatusFilterChange = async (newStatus: string) => {
    try {
      console.log(`=== STATUS FILTER CHANGE ===`);
      console.log(`Current status filter: ${statusFilter}`);
      console.log(`New status filter: ${newStatus}`);
      console.log(`About to call fetchClients with status: ${newStatus}`);
      
      setIsPageLoading(true);
      setStatusFilter(newStatus);
      setCurrentPage(1); // Reset to first page when changing filter
      
      // Fetch clients with new filter - pass the new status directly
      await fetchClients(1, pageSize, newStatus);
      
      console.log(`=== STATUS FILTER CHANGE COMPLETE ===`);
      console.log(`Status filter updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error changing status filter:", error);
      toast({
        title: "Error",
        description: "Failed to change status filter",
        variant: "destructive",
      });
    } finally {
      setIsPageLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    setDeletingClientId(clientId);
    try {
      const response = await apiRequest(endpoints.clients.delete.replace(':id', clientId), "PUT");
      if (response.data?.success) {
        toast({
          title: "Success",
          description: "Client deactivated successfully",
        });
        // Refresh the clients list
        fetchClients(currentPage, pageSize, statusFilter);
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
    fetchClients(currentPage, pageSize, statusFilter);
  };

  const handleEditCancel = () => {
    setEditingClientId(null);
  };

  return (
    <div className="">
      {/* Filters */}
      <Card className="border-none rounded-none px-4 pb-4 pt-2">
        <CardContent className="p-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-32 bg-gray-50">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            
            {/* Filter Summary */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {statusFilter !== "all" && (
                <>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    {statusFilter === "active" ? "Active Only" : "Inactive Only"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleStatusFilterChange("all")}
                    className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </Button>
                </>
              )}
              <span>Showing {clients.length} of {totalCount} clients</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Table */}
      <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-scroll">
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      Loading clients...
                    </div>
                  </TableCell>
                </TableRow>
              ) : clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No clients found
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && totalCount > 0 && (
        <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * pageSize) + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of{" "}
              {totalCount} clients
              {isPageLoading && (
                <span className="ml-2 text-blue-600">
                  <Loader2 className="inline w-3 h-3 animate-spin mr-1" />
                  Loading...
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-4">
              {/* Go to page input */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Go to page:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      handlePageChange(page);
                    }
                  }}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-500">of {totalPages}</span>
              </div>
              
              <Pagination>
                <PaginationContent>
                  {/* First page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1"
                    >
                      First
                    </Button>
                  </PaginationItem>
                  
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="flex items-center gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                  </PaginationItem>
                  
                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current page
                    const shouldShow = 
                      page === 1 || 
                      page === totalPages || 
                      Math.abs(page - currentPage) <= 1;
                    
                    if (shouldShow) {
                      return (
                        <PaginationItem key={page}>
                          <Button
                            variant={page === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        </PaginationItem>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <span className="flex h-9 w-9 items-center justify-center text-sm">
                            ...
                          </span>
                        </PaginationItem>
                      );
                    }
                    return null;
                  })}
                  
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="flex items-center gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </PaginationItem>
                  
                  {/* Last page button */}
                  <PaginationItem>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1"
                    >
                      Last
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
      
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
