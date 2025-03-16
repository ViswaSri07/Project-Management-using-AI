import { NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description, userId } = await request.json()

    // Verify that the userId matches the authenticated user
    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await db.project.create({
      data: {
        title,
        description,
        userId,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Error creating project:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

