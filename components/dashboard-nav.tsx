import Link from "next/link"
import { KanbanSquare } from "lucide-react"

export function DashboardNav() {
  return (
    <div className="flex items-center">
      <Link href="/dashboard" className="flex items-center">
        <KanbanSquare className="h-6 w-6 mr-2" />
        <span className="font-bold text-lg">AI Kanban</span>
      </Link>
      <nav className="ml-8 hidden md:flex items-center space-x-4">
        <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
          Dashboard
        </Link>
      </nav>
    </div>
  )
}

