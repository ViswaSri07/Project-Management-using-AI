import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase-server"
import { db } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = await createServerComponentClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    // Find the task and verify access
    const task = await db.task.findUnique({
      where: {
        id: id,
      },
      include: {
        project: {
          include: {
            members: true,
          },
        },
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Allow owner OR any project member to update task status
    const isOwner = task.project.userId === user.id
    const isMember = task.project.members.some((m) => m.userId === user.id || m.email === user.email?.toLowerCase())

    if (!isOwner && !isMember) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the task
    const updatedTask = await db.task.update({
      where: {
        id: id,
      },
      data: {
        status,
      },
    })

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
