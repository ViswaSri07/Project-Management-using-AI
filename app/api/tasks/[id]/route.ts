import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()

    // Find the task and verify ownership
    const task = await db.task.findUnique({
      where: {
        id: params.id,
      },
      include: {
        project: true,
      },
    })

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (task.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update the task
    const updatedTask = await db.task.update({
      where: {
        id: params.id,
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

