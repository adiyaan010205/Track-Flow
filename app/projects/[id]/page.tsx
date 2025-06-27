import { getCurrentUser } from "@/lib/server-only/auth"
import { redirect } from "next/navigation"
import { ProjectModel } from "@/lib/server-only/models/Project"
import { TaskModel } from "@/lib/server-only/models/Task"
import { UserModel } from "@/lib/server-only/models/User"
import ProjectDetailContent from "@/components/projects/project-detail-content"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const project = await ProjectModel.findById(params.id)

    if (!project) {
      redirect("/projects")
    }

    const projectWithStringId = {
      _id: project._id?.toString() || "",
      title: project.title,
      description: project.description,
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      startDate: project.startDate.toISOString(),
      dueDate: project.dueDate.toISOString(),
      owner: project.owner.toString(),
      members: project.members?.map(id => id.toString()) || [],
      tags: project.tags || [],
      color: project.color || "#3B82F6",
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    }

    const tasks = (await TaskModel.findByProject(params.id)).map((task) => ({
      _id: task._id?.toString() || "",
      title: task.title,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee?.toString() || "",
      dueDate: task.dueDate instanceof Date ? task.dueDate.toISOString() : String(task.dueDate),
      createdAt: task.createdAt instanceof Date ? task.createdAt.toISOString() : String(task.createdAt),
    }))
    const users = (await UserModel.findAll()).map((user) => ({
      _id: user._id?.toString() || "",
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || undefined,
      lastActive: user.lastActive ? (user.lastActive instanceof Date ? user.lastActive.toISOString() : String(user.lastActive)) : undefined,
    }))

    return <ProjectDetailContent user={user} project={projectWithStringId} tasks={tasks} users={users} />
  } catch (error) {
    console.error("Error loading project:", error)
    redirect("/projects")
  }
}
