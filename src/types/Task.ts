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