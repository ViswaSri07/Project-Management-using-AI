import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { db } from "@/lib/db"

export default async function DashboardPage() {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const projects = await db.project.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">No projects yet</h2>
          <p className="text-muted-foreground mb-6">Create your first project to get started with AI task generation</p>
          <Button asChild>
            <Link href="/projects/new">
              <Plus className="mr-2 h-4 w-4" /> Create Project
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  )
}

