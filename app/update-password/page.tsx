import { UpdatePasswordForm } from "./update-password-form"

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Update your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Enter your new password below</p>
        </div>
        <UpdatePasswordForm />
      </div>
    </div>
  )
}

