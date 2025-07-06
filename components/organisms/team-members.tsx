"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../atoms/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Circle,
  Code,
  Crown,
  EllipsisVerticalIcon,
  Grid2X2Icon,
  GridIcon,
  ChartBar,
  Edit,
  Settings,
  UserCog,
  UserRoundX,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Avatar, AvatarImage } from "../ui/avatar";
import utils from "@/utils/index.util";

const mockData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    assigned: ["All assigned"],
    lastLogin: "10/10/2021",
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe 2",
    email: "john.doe2@example.com",
    role: "Developer",
    assigned: ["Max", "Sophie"],
    lastLogin: "10/10/2021",
    status: "Pending",
  },
];

const getRoleIcon = (role: string, className?: string) => {
  switch (role.toLowerCase()) {
    case "admin":
      return <Crown className={className} />;
    case "developer":
      return <Code className={className} />;
    case "analyst":
      return <ChartBar className={className} />;
  }
};

const TeamMembers = () => {
  const [view, setView] = useState<"grid" | "list">("grid");

  const handleViewChange = (view: "grid" | "list") => {
    setView(view);
  };

  const [filteredMembers, setFilteredMembers] = useState<any[]>(mockData);

  useEffect(() => {
    const filtered = mockData.filter((item) => ({
      ...item,
      selected: false,
    }));
    setFilteredMembers(filtered);
  }, []);

  const handleSelectAll = (checked: boolean) => {
    setFilteredMembers(
      filteredMembers.map((item) => ({ ...item, selected: checked }))
    );
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    setFilteredMembers(
      filteredMembers.map((item) =>
        item.id === id ? { ...item, selected: checked } : item
      )
    );
  };

  return (
    <>
      {/* Header */}
      <div className="w-full px-4 pt-2 pb-4 bg-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input placeholder="Search" className="w-full" />
          <Select>
            <SelectTrigger className="w-full bg-gray-50">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full bg-gray-50">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-gray-100 text-gray-700 hover:bg-gray-200">
            Bulk Actions{" "}
            {filteredMembers.filter((item) => item.selected).length > 0 &&
              `(${filteredMembers.filter((item) => item.selected).length})`}
          </Button>
          <div className="flex items-center bg-gray-100 rounded-md p-1 gap-1">
            <Button
              className={`h-8 w-8 text-gray-700 hover:bg-white rounded-md ${
                view === "grid" ? "bg-white" : "bg-gray-100"
              }`}
              onClick={() => handleViewChange("grid")}
            >
              <GridIcon />
            </Button>
            <Button
              className={`h-8 w-8 text-gray-700 hover:bg-white rounded-md ${
                view === "list" ? "bg-white" : "bg-gray-100"
              }`}
              onClick={() => handleViewChange("list")}
            >
              <Grid2X2Icon />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="shadow-lg shadow-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>
                  <Checkbox
                    checked={filteredMembers.every((item) => item.selected)}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {filteredMembers.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={item.selected}
                      onClick={() => handleSelectItem(item.id, !item.selected)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div
                      className={`flex items-center text-xs w-fit font-semibold rounded-full px-2 py-1 gap-1 ${utils.colors.getRoleColor(
                        item.role
                      )}`}
                    >
                      <div>{getRoleIcon(item.role, "w-4 h-4")}</div>
                      <div>{item.role}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {utils.string.joinStrings(item.assigned)}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {item.lastLogin}
                  </TableCell>
                  <TableCell>
                    <div
                      className={`text-xs w-fit font-semibold flex items-center gap-1 rounded-full px-2 py-1 ${utils.colors.getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 w-6 h-6"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 w-6 h-6"
                      >
                        <UserCog className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 w-6 h-6"
                      >
                        <UserRoundX className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default TeamMembers;
