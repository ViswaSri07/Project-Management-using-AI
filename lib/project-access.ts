import { db } from "@/lib/db"

export type ProjectRole = "MANAGER" | "MEMBER"

export interface ProjectAccess {
  project: any
  role: ProjectRole
}

/**
 * Check if a user has access to a project, either as the owner (MANAGER)
 * or as an invited member (MEMBER). Matches members by both userId and email.
 */
export async function getProjectWithAccess(
  projectId: string,
  userId: string,
  includeTasks: boolean = false,
  userEmail?: string
): Promise<ProjectAccess | null> {
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      tasks: includeTasks,
      members: true,
    },
  })

  if (!project) return null

  // Check if user is the owner (manager)
  if (project.userId === userId) {
    return { project, role: "MANAGER" }
  }

  // Check if user is an invited member (by userId or email)
  const membership = project.members.find(
    (m) =>
      m.userId === userId ||
      (userEmail && m.email === userEmail.toLowerCase())
  )
  if (membership) {
    return { project, role: membership.role as ProjectRole }
  }

  return null
}
