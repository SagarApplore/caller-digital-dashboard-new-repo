import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, RefreshCw } from "lucide-react"

export function Filters() {
  return (
    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select defaultValue="all-status">
            <SelectTrigger className="w-32 bg-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-assistants">
            <SelectTrigger className="w-40 bg-white">
              <SelectValue placeholder="All Assistants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-assistants">All Assistants</SelectItem>
              <SelectItem value="sophia">Sophia AI</SelectItem>
              <SelectItem value="max">Max AI</SelectItem>
              <SelectItem value="emma">Emma AI</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="bg-white">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-white">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="bg-white">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
    </div>
  )
}
