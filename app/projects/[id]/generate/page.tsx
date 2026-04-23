import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { db } from "@/lib/db"
import { TaskGenerator } from "./task-generator"
import { getProjectWithAccess } from "@/lib/project-access"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

interface GenerateTasksPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function GenerateTasksPage({ params }: GenerateTasksPageProps) {
  const { id } = await params
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const access = await getProjectWithAccess(id, user.id)

  if (!access) {
    redirect("/dashboard")
  }

  // Only managers can generate tasks — redirect members to the board
  if (access.role !== "MANAGER") {
    redirect(`/projects/${id}/board`)
  }

  const project = access.project

  const tasksCount = await db.task.count({
    where: {
      projectId: id,
    },
  })

  return (
    <div className="container mx-auto py-10">
      <Link href="/dashboard" className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-2">{project!.title}</h1>
      <p className="text-muted-foreground mb-8">{project!.description}</p>

      {tasksCount > 0 ? (
        <div className="bg-muted p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Tasks Already Generated</h2>
          <p className="mb-4">
            This project already has {tasksCount} tasks. Generating new tasks will replace the existing ones.
          </p>
          <TaskGenerator project={{ id: project!.id, title: project!.title, description: project!.description }} regenerate={true} />
        </div>
      ) : (
        <TaskGenerator project={{ id: project!.id, title: project!.title, description: project!.description }} regenerate={false} />
      )}
    </div>
  )
}
