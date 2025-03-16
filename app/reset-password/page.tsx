import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { ResetPasswordForm } from "./reset-password-form"

export default async function ResetPasswordPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  )
}

