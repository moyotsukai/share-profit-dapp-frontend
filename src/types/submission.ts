import { User } from "./User"

export type SubmissionStage = "inReview" | "accepted" | "rejected"

export type EditingSubmission = {
  projectId: string,
  taskId: string,
  userId: string,
  fileUrl?: string,
  link?: string,
  message?: string,
  stage: SubmissionStage
}

export type Submission = EditingSubmission & {
  id: string,
  user: User
}
