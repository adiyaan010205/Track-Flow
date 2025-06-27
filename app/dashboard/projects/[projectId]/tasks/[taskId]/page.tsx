import { getCurrentUser } from "@/lib/server-only/auth"
import { redirect } from "next/navigation"
import { TaskModel } from "@/lib/server-only/models/Task"
import { ProjectModel } from "@/lib/server-only/models/Project"
import SubtaskManagementContent from "@/components/tasks/subtask-management-content"

interface SubtaskPageProps {
  params: {
    projectId: string
    taskId: string
  }
}

export default async function SubtaskManagementPage({ params }: SubtaskPageProps) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  try {
    const task = await TaskModel.findById(params.taskId)
    const project = await ProjectModel.findById(params.projectId)

    if (!task || !project) {
      redirect("/tasks")
    }

    // Convert server-side task to client-side format
    const clientTask = {
      _id: task._id?.toString() || "",
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.toISOString(),
      estimatedHours: task.estimatedHours,
      project: task.project.toString(),
    }

    const clientProject = {
      _id: project._id?.toString() || "",
      title: project.title,
      color: project.color || "#3B82F6",
    }

    return <SubtaskManagementContent user={user} task={clientTask} project={clientProject} />
  } catch (error) {
    console.error("Error loading task:", error)
    redirect("/tasks")
  }
}
