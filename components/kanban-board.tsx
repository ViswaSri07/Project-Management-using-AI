"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { TaskCard } from "./task-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Task {
  id: string
  title: string
  description: string
  status: string
  priority: string
  dueDate: Date | null
  category: string | null
}

interface KanbanBoardProps {
  projectId: string
  columns: {
    todo: Task[]
    inProgress: Task[]
    done: Task[]
  }
}

export function KanbanBoard({ projectId, columns }: KanbanBoardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [filter, setFilter] = useState<string>("all")
  const [sort, setSort] = useState<string>("priority")

  async function updateTaskStatus(taskId: string, status: string) {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task status")
      }

      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task status. Please try again.",
      })
    }
  }

  // Filter tasks based on selected filter
  const filterTasks = (tasks: Task[]) => {
    if (filter === "all") return tasks
    return tasks.filter((task) => task.priority.toLowerCase() === filter.toLowerCase())
  }

  // Sort tasks based on selected sort option
  const sortTasks = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      if (sort === "priority") {
        const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
        return (
          priorityOrder[a.priority as keyof typeof priorityOrder] -
          priorityOrder[b.priority as keyof typeof priorityOrder]
        )
      } else if (sort === "dueDate") {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      } else {
        return a.title.localeCompare(b.title)
      }
    })
  }

  // Apply filters and sorting
  const filteredColumns = {
    todo: sortTasks(filterTasks(columns.todo)),
    inProgress: sortTasks(filterTasks(columns.inProgress)),
    done: sortTasks(filterTasks(columns.done)),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <label className="text-sm font-medium mb-1 block">Filter by Priority</label>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-48">
            <label className="text-sm font-medium mb-1 block">Sort by</label>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* To Do Column */}
        <div className="bg-muted rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-4">To Do</h2>
          <div className="space-y-4">
            {filteredColumns.todo.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks</p>
            ) : (
              filteredColumns.todo.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={(status) => updateTaskStatus(task.id, status)} />
              ))
            )}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-muted rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-4">In Progress</h2>
          <div className="space-y-4">
            {filteredColumns.inProgress.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks</p>
            ) : (
              filteredColumns.inProgress.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={(status) => updateTaskStatus(task.id, status)} />
              ))
            )}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-muted rounded-lg p-4">
          <h2 className="font-semibold text-lg mb-4">Done</h2>
          <div className="space-y-4">
            {filteredColumns.done.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No tasks</p>
            ) : (
              filteredColumns.done.map((task) => (
                <TaskCard key={task.id} task={task} onStatusChange={(status) => updateTaskStatus(task.id, status)} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

