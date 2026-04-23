import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, KanbanSquare, Sparkles, Users } from "lucide-react"

interface Project {
  id: string
  title: string
  description: string
  createdAt: Date
  _count?: {
    tasks: number
  }
}

interface ProjectCardProps {
  project: Project
  role?: "MANAGER" | "MEMBER"
}

export function ProjectCard({ project, role = "MANAGER" }: ProjectCardProps) {
  const taskCount = project._count?.tasks || 0
  const isManager = role === "MANAGER"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{project.title}</CardTitle>
          {!isManager && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" /> Shared
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-1 h-4 w-4" />
          Created on {format(new Date(project.createdAt), "MMM d, yyyy")}
        </div>
        <div className="mt-4">
          <Badge variant={taskCount > 0 ? "default" : "outline"}>
            {taskCount} {taskCount === 1 ? "task" : "tasks"}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {taskCount > 0 ? (
          <Button asChild variant="outline">
            <Link href={`/projects/${project.id}/board`}>
              <KanbanSquare className="mr-2 h-4 w-4" /> View Board
            </Link>
          </Button>
        ) : isManager ? (
          <Button asChild>
            <Link href={`/projects/${project.id}/generate`}>
              <Sparkles className="mr-2 h-4 w-4" /> Generate Tasks
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href={`/projects/${project.id}/board`}>
              <KanbanSquare className="mr-2 h-4 w-4" /> View Board
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
