"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserPlus, X, Users, Mail } from "lucide-react"

interface Member {
  id: string
  userId: string
  email: string
  role: string
  createdAt: string
}

interface TeamPanelProps {
  projectId: string
}

export function TeamPanel({ projectId }: TeamPanelProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch members on mount
  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch(`/api/projects/${projectId}/members`)
        if (response.ok) {
          const data = await response.json()
          setMembers(data)
        }
      } catch (error) {
        console.error("Error fetching members:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMembers()
  }, [projectId])

  async function inviteMember(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setIsInviting(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite member")
      }

      setMembers((prev) => [...prev, data])
      setEmail("")
      toast({
        title: "Member invited",
        description: `${email} has been added to this project.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to invite member",
      })
    } finally {
      setIsInviting(false)
    }
  }

  async function removeMember(memberId: string, memberEmail: string) {
    try {
      const response = await fetch(`/api/projects/${projectId}/members`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to remove member")
      }

      setMembers((prev) => prev.filter((m) => m.id !== memberId))
      toast({
        title: "Member removed",
        description: `${memberEmail} has been removed from this project.`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove member",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" /> Team Members
        </CardTitle>
        <CardDescription>
          Invite team members by email to collaborate on this project. Members can view the board and update task statuses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Invite form */}
        <form onSubmit={inviteMember} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="teammate@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-9"
              disabled={isInviting}
            />
          </div>
          <Button type="submit" disabled={isInviting || !email.trim()}>
            {isInviting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 h-4 w-4" />
            )}
            Invite
          </Button>
        </form>

        {/* Members list */}
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No team members yet. Invite someone to get started!
          </p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                    {member.email.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{member.email}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {member.role}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(member.id, member.email)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
