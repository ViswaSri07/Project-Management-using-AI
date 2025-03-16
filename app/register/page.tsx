import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { RegisterForm } from "./register-form"

export default async function RegisterPage() {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your email below to create your account</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}

