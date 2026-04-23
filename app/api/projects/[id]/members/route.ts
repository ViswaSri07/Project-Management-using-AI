import { NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase-server"
import { db } from "@/lib/db"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createServerComponentClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only the project owner can invite members
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the project manager can invite members" },
        { status: 403 }
      )
    }

    const { email } = await request.json()

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Don't allow inviting yourself
    if (normalizedEmail === user.email?.toLowerCase()) {
      return NextResponse.json(
        { error: "You cannot invite yourself" },
        { status: 400 }
      )
    }

    // Check if already a member (by email)
    const existingMembership = await db.projectMember.findFirst({
      where: {
        email: normalizedEmail,
        projectId,
      },
    })

    if (existingMembership) {
      return NextResponse.json(
        { error: "This user is already a member of this project" },
        { status: 409 }
      )
    }

    // Create the membership using email
    // userId will be matched when the member accesses their dashboard
    const member = await db.projectMember.create({
      data: {
        userId: normalizedEmail, // Use email as temp userId; will be resolved on login
        email: normalizedEmail,
        role: "MEMBER",
        projectId,
      },
    })

    return NextResponse.json(member)
  } catch (error) {
    console.error("Error inviting member:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createServerComponentClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify user has access to this project
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { members: true },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const isOwner = project.userId === user.id
    const isMember = project.members.some(
      (m) => m.userId === user.id || m.email === user.email?.toLowerCase()
    )

    if (!isOwner && !isMember) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(project.members)
  } catch (error) {
    console.error("Error fetching members:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params
    const supabase = await createServerComponentClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only the project owner can remove members
    const project = await db.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    if (project.userId !== user.id) {
      return NextResponse.json(
        { error: "Only the project manager can remove members" },
        { status: 403 }
      )
    }

    const { memberId } = await request.json()

    if (!memberId) {
      return NextResponse.json(
        { error: "Member ID is required" },
        { status: 400 }
      )
    }

    await db.projectMember.delete({
      where: { id: memberId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing member:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
