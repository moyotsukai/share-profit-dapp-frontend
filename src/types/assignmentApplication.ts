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
  id: string,
  user: User
}

export const assignmentApplicationStageDisplayText = (stage: AssignmentApplicationStage): string => {
  if (stage === "inReview") { return "In Review" }
  if (stage === "accepted") { return "Accepted" }
  if (stage === "rejected") { return "Rejected" }
  return ""
}
