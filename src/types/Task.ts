export type TaskStage = "todo" | "inProgress" | "inReview" | "done"

export type Task = {
  id: string,
  title: string,
  stage: TaskStage,
  outline?: string,
  details: string,
  bountySbt: number,
  ownerId: string,
  asigneeIds: string[]
}

export type TaskIndex = {
  taskId: string,
  index: number
}

export const taskStageDisplayText = (stage: TaskStage): string => {
  if (stage === "todo") { return "To Do" }
  if (stage === "inProgress") { return "In Progress" }
  if (stage === "inReview") { return "In Review" }
  if (stage === "done") { return "Done" }
  return ""
}