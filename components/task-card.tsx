"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronDown, Tag } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: Date | null
  category: string | null
}

interface TaskCardProps {
  task: Task
  onStatusChange: (status: string) => void
}

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const priorityColors = {
    LOW: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    MEDIUM: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    HIGH: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    CRITICAL: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  }

  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.MEDIUM

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{task.title}</CardTitle>
          <Badge className={priorityColor}>{task.priority.toLowerCase()}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <CardDescription className={`${isExpanded ? "" : "line-clamp-2"}`}>{task.description}</CardDescription>
        {task.description.length > 100 && (
          <Button variant="link" size="sm" className="p-0 h-auto mt-1" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Show less" : "Show more"}
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
          {task.category && (
            <div className="flex items-center">
              <Tag className="h-3 w-3 mr-1" />
              {task.category}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              Move <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onStatusChange("TODO")}>To Do</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("IN_PROGRESS")}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange("DONE")}>Done</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

