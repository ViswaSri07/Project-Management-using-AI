import { redirect } from "next/navigation"
import { createServerComponentClient } from "@/lib/supabase-server"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function Home() {
  const supabase = createServerComponentClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">AI-Powered Kanban Board</h1>
        <p className="mt-6 text-xl text-muted-foreground">
          Create projects and let AI generate tasks for you. Organize your work with a simple, intuitive Kanban board.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Button asChild size="lg">
            <Link href="/login">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

