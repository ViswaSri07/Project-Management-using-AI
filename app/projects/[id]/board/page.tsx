import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { Sparkles, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface BoardPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const project = await db.project.findUnique({
    where: {
      id,
      userId: user.id,
    },
    include: {
      tasks: true,
    },
  })

  if (!project) {
    redirect("/dashboard")
  }

  // Group tasks by status
  const columns = {
    todo: project.tasks.filter((task) => task.status === "TODO"),
    inProgress: project.tasks.filter((task) => task.status === "IN_PROGRESS"),
    done: project.tasks.filter((task) => task.status === "DONE"),
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-muted-foreground mb-8">{project.description}</p>

      {project.tasks.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No tasks yet</h2>
          <p className="text-muted-foreground mb-6">Generate tasks for this project to get started</p>
          <Button asChild>
            <Link href={`/projects/${project.id}/generate`}>
              <Sparkles className="mr-2 h-4 w-4" /> Generate Tasks
            </Link>
          </Button>
        </div>
      ) : (
        <KanbanBoard projectId={project.id} columns={columns} />
      )}
    </div>
  )
}

