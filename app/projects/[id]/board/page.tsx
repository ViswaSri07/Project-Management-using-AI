import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { KanbanBoard } from "@/components/kanban-board"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"
import { Link } from "@nextui-org/react"

interface BoardPageProps {
  params: {
    id: string
  }
}

export default async function BoardPage({ params }: BoardPageProps) {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const project = await db.project.findUnique({
    where: {
      id: params.id,
      userId: session.user.id,
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

