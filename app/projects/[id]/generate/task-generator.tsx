"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface TaskGeneratorProps {
  project: {
    id: string
    title: string
    description: string
  }
  regenerate: boolean
}

export function TaskGenerator({ project, regenerate }: TaskGeneratorProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  async function generateTasks() {
    setIsGenerating(true)

    try {
      const response = await fetch(`/api/projects/${project.id}/generate-tasks`, {
        method: "POST",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to generate tasks")
      }

      toast({
        title: "Tasks generated",
        description: "AI has successfully generated tasks for your project.",
      })

      router.push(`/projects/${project.id}/board`)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Task Generation</CardTitle>
        <CardDescription>Let AI analyze your project and generate a comprehensive task breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-md">
            <h3 className="font-medium mb-2">The AI will generate:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Task titles and detailed descriptions</li>
              <li>Realistic deadlines for each task</li>
              <li>Priority levels (low, medium, high, critical)</li>
              <li>Task categories</li>
              <li>Task dependencies</li>
            </ul>
          </div>
          <Button onClick={generateTasks} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {regenerate ? "Regenerate Tasks" : "Generate Tasks"}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

