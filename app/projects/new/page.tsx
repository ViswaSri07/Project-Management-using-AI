import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { NewProjectForm } from "./new-project-form"

export default async function NewProjectPage() {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <div className="max-w-2xl">
        <NewProjectForm userId={session.user.id} />
      </div>
    </div>
  )
}

