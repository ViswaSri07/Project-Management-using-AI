import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { TaskGenerator } from "./task-generator"

interface GenerateTasksPageProps {
  params: {
    id: string
  }
}

export default async function GenerateTasksPage({ params }: GenerateTasksPageProps) {
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
  })

  if (!project) {
    redirect("/dashboard")
  }

  const tasksCount = await db.task.count({
    where: {
      projectId: params.id,
    },
  })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-muted-foreground mb-8">{project.description}</p>

      {tasksCount > 0 ? (
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Tasks Already Generated</h2>
          <p className="mb-4">
            This project already has {tasksCount} tasks. Generating new tasks will replace the existing ones.
          </p>
          <TaskGenerator project={project} regenerate={true} />
        </div>
      ) : (
        <TaskGenerator project={project} regenerate={false} />
      )}
    </div>
  )
}

