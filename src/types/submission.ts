import { User } from "./User"

export type SubmissionStage = "inReview" | "accepted" | "rejected"

export type EditingSubmission = {
  projectId: string,
  taskId: string,
  userId: string,
  link?: string,
  fileUrl?: string,
  message?: string,
  stage: SubmissionStage
}

export type Submission = EditingSubmission & {
  id: string
}

export type LocalSubmission = Submission & {
  user: User
}