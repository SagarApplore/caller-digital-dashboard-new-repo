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
} from "lucide-react";
import utils from "@/utils/index.util";
import { useState } from "react";
import { useEffect } from "react";
import apiRequest from "@/utils/api";

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

export function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const response = await apiRequest("/users/getClients", "GET");
      console.log(response.data);

      setClients(response.data);
    };
    fetchClients();
  }, []);

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
      <div className="p-4">
        <div className="rounded-lg shadow-lg shadow-gray-200">
          <Table className="border-none">
            <TableHeader className="bg-gray-100">
              <TableRow className="border-gray-100">
                <TableHead>Company</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>AM</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Assistants</TableHead>
                <TableHead>Channels</TableHead>
                <TableHead>Health</TableHead>
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
                    <div
                      className={`text-xs w-fit font-medium rounded-full px-2 py-1 ${getIndustryColor(
                        client.industry
                      )}`}
                    >
                      {client.industry}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {client.am}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {utils.string.formatCurrency(client.mrr)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-xs w-fit font-semibold px-4 py-1 rounded-full ${getPlanColor(
                        client.plan
                      )}`}
                    >
                      {client.plan}
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
                      {client.channels?.map((channel: string) => {
                        const { icon, color } = getChannelIconAndColor(channel);
                        return (
                          <div
                            className={`flex items-center ${color} rounded-full px-2 py-2`}
                          >
                            {icon}
                          </div>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-xs w-fit font-semibold ${getHealthColor(
                        client.health
                      )}`}
                    >
                      {client.health}%
                    </div>
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-xs w-fit font-semibold flex items-center gap-1 rounded-full px-2 py-1 ${utils.colors.getStatusColor(
                        client.status
                      )}`}
                    >
                      <Circle
                        className="w-2 h-2"
                        fill="currentColor"
                        stroke="currentColor"
                      />
                      {client.status}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                      >
                        Deactivate
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default ClientsPage;
