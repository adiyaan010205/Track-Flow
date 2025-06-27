import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/server-only/auth"
import { InvitationModel } from "@/lib/server-only/models/Invitation"
import { TeamMemberModel } from "@/lib/server-only/models/TeamMember"

interface RouteParams {
  params: {
    id: string
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { status } = await request.json()
    const { id } = params

    if (!["accepted", "declined"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const invitation = await InvitationModel.updateById(id, { status })

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 })
    }

    if (status === "accepted") {
      // Map "admin" role to "team_leader" for team members
      const teamRole = invitation.role === "admin" ? "team_leader" : invitation.role
      
      await TeamMemberModel.create({
        userId: invitation.userId,
        workspaceId: invitation.workspaceId,
        role: teamRole,
        status: "active",
      })
    }

    return NextResponse.json({ invitation })
  } catch (error) {
    console.error("Update invitation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 