import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { ProjectCard } from "@/components/project-card"
import { db } from "@/lib/db"

export default async function DashboardPage() {
  const supabase = await createServerComponentClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch projects owned by the user
  const ownedProjects = await db.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  })

  // Fetch projects shared with the user
  // Fetch projects shared with the user (match by email)
  const sharedMemberships = await db.projectMember.findMany({
    where: {
      email: user.email?.toLowerCase() || "",
    },
    include: {
      project: {
        include: {
          _count: {
            select: { tasks: true },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  const sharedProjects = sharedMemberships.map((m) => ({
    ...m.project,
    _memberRole: m.role,
  }))

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

      {ownedProjects.length === 0 ? (
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
          {ownedProjects.map((project) => (
            <ProjectCard key={project.id} project={project} role="MANAGER" />
          ))}
        </div>
      )}

      {/* Shared with me section */}
      {sharedProjects.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Shared with me</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedProjects.map((project) => (
              <ProjectCard key={project.id} project={project} role="MEMBER" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
