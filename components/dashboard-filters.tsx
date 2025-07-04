import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Download, Phone, MessageSquare, Mail, Grid3X3, BarChart3 } from "lucide-react"

export function DashboardFilters() {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Date Filter */}
          <Select defaultValue="7days">
            <SelectTrigger className="w-36 bg-white h-9">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
            </SelectContent>
          </Select>

          {/* Assistants Filter */}
          <Select defaultValue="all">
            <SelectTrigger className="w-36 bg-white h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Assistants</SelectItem>
              <SelectItem value="sophia">Sophia AI</SelectItem>
            </SelectContent>
          </Select>

          {/* Channel Filters */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-white h-9 px-3">
              All
            </Badge>
            <Badge variant="outline" className="bg-white h-9 px-3 flex items-center space-x-1">
              <Phone className="w-3 h-3" />
              <span>Voice</span>
            </Badge>
            <Badge variant="outline" className="bg-white h-9 px-3 flex items-center space-x-1">
              <MessageSquare className="w-3 h-3" />
              <span>Chat</span>
            </Badge>
            <Badge variant="outline" className="bg-white h-9 px-3 flex items-center space-x-1">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" className="bg-white h-9">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="bg-white h-9 w-9 p-0">
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="bg-white h-9 w-9 p-0">
            <BarChart3 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
