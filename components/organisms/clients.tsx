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
import { Plus, Search, Building, Mail, Phone, Calendar } from "lucide-react";
import utils from "@/utils/index.util";

const clients = [
  {
    id: 1,
    name: "Acme Corporation",
    contact: "John Smith",
    email: "john@acme.com",
    status: "Active",
    assistants: 5,
    lastActivity: "2 hours ago",
    plan: "Enterprise",
    industry: "BFSI",
    mrr: 100000,
  },
  {
    id: 2,
    name: "TechStart Inc",
    contact: "Sarah Johnson",
    email: "sarah@techstart.com",
    status: "Active",
    assistants: 3,
    lastActivity: "1 day ago",
    plan: "Professional",
    industry: "D2C",
    mrr: 50000,
  },
  {
    id: 3,
    name: "Global Solutions",
    contact: "Mike Wilson",
    email: "mike@globalsol.com",
    status: "Inactive",
    assistants: 1,
    lastActivity: "1 week ago",
    plan: "Basic",
    industry: "D2C",
    mrr: 20000,
  },
];

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

export function ClientsPage() {
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
                  key={client.id}
                  className="hover:bg-gray-50 border-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                          {client.name
                            .split(" ")
                            .map((n) => n[0])
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
                        {client.industry}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">
                        {client.contact}
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
                        {client.assistants}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{client.lastActivity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{client.lastActivity}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{client.lastActivity}</span>
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
