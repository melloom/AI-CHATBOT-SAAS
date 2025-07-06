"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Mail, Trash2, MoreHorizontal } from "lucide-react"
import { InviteTeamMemberDialog } from "@/components/team/invite-team-member-dialog"
import { useTeam } from "@/hooks/use-team"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function TeamPage() {
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const { teamMembers, invites, loading, inviteTeamMember, removeTeamMember, resendInvite } = useTeam()
  const { toast } = useToast()

  const handleInviteTeamMember = async (data: { email: string; role: string }) => {
    try {
      await inviteTeamMember(data.email, data.role)
      setInviteDialogOpen(false)
      toast({
        title: "Invitation sent!",
        description: `An invitation has been sent to ${data.email}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to send invitation",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleRemoveTeamMember = async (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      try {
        await removeTeamMember(memberId)
        toast({
          title: "Team member removed",
          description: `${memberName} has been removed from the team.`,
        })
      } catch (error) {
        toast({
          title: "Failed to remove team member",
          description: "Please try again later.",
          variant: "destructive",
        })
      }
    }
  }

  const handleResendInvite = async (inviteId: string, email: string) => {
    try {
      await resendInvite(inviteId)
      toast({
        title: "Invitation resent",
        description: `A new invitation has been sent to ${email}.`,
      })
    } catch (error) {
      toast({
        title: "Failed to resend invitation",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      case "developer":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
      case "support":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-muted-foreground">Invite team members and manage their roles and permissions</p>
        </div>
        <Button onClick={() => setInviteDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Invite Team Member
        </Button>
      </div>

      {/* Team Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Team Members</CardTitle>
          <CardDescription className="text-muted-foreground">Active team members with access to your chatbot platform</CardDescription>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No team members yet</p>
              <Button variant="outline" className="mt-2 bg-transparent" onClick={() => setInviteDialogOpen(true)}>
                Invite your first team member
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-border">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {member.name
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || member.email[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{member.name || member.email}</p>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        Last active: {formatDistanceToNow(new Date(member.lastActive))} ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(member.role)}>{member.role}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleRemoveTeamMember(member.id, member.name || member.email)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove from team
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Pending Invitations</CardTitle>
            <CardDescription className="text-muted-foreground">Team members who haven't accepted their invitations yet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invites.map((invite) => (
                <div key={invite.id} className="flex items-center justify-between p-4 border rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-200 dark:bg-yellow-800 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{invite.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Invited {formatDistanceToNow(new Date(invite.createdAt))} ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(invite.role)}>{invite.role}</Badge>
                    <Badge variant="outline" className="border-yellow-300 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300">Pending</Badge>
                    <Button variant="outline" size="sm" onClick={() => handleResendInvite(invite.id, invite.email)}>
                      Resend
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Roles & Permissions</CardTitle>
          <CardDescription className="text-muted-foreground">Understanding what each role can do in your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg dark:border-border">
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 mb-2">Admin</Badge>
              <h4 className="font-medium mb-2 text-foreground">Full Access</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Manage team members</li>
                <li>• Access billing settings</li>
                <li>• Configure all chatbots</li>
                <li>• View all analytics</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg dark:border-border">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300 mb-2">Developer</Badge>
              <h4 className="font-medium mb-2 text-foreground">Technical Access</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create and edit chatbots</li>
                <li>• Access API settings</li>
                <li>• View technical logs</li>
                <li>• Configure integrations</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg dark:border-border">
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 mb-2">Support</Badge>
              <h4 className="font-medium mb-2 text-foreground">Support Access</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View chat conversations</li>
                <li>• Test chatbots</li>
                <li>• Access basic analytics</li>
                <li>• Export conversation data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <InviteTeamMemberDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onSubmit={handleInviteTeamMember}
      />
    </div>
  )
}
