import { User } from "./User"

export type AssignmentApplicationStage = "inReview" | "accepted" | "rejected"

export type EditingAssignmentApplication = {
  projectId: string,
  taskId: string,
  userId: string,
  message?: string,
  stage: AssignmentApplicationStage
}

export type AssignmentApplication = EditingAssignmentApplication & {
  id: string
}

export type LocalAssignmentApplication = AssignmentApplication & {
  user: User
}