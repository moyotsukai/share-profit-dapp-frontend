import React from "react"
import { useDrop } from "react-dnd"
import * as s from "./style"
import DraggableTask from "../DraggableTask/DraggableTask"
import { TaskStage } from "@/types/Task"
import Divider from "@/components/ui/Divider"
import Spacer from "@/components/ui/Spacer"
import AddNewTaskDialog from "../AddNewTaskDialog"
import { useUserValue } from "@/states/userState"
import { useProjectValue, useTaskIndexesValue, useTasksValue } from "@/states/projectState"

export type DropResult = {
  taskStage: TaskStage
}

type Props = {
  columnStage: TaskStage,
  title: string
}

const DroppableTaskColumn: React.FC<Props> = ({ columnStage, title }) => {

  const user = useUserValue()
  const project = useProjectValue()
  const isProjectOwner = project && user && project.ownerIds.includes(user.uid)

  const [_, drop] = useDrop<DraggableTask>({
    accept: ["item"],
    drop: () => {
      const dropResult: DropResult = {
        taskStage: columnStage
      }
      return dropResult
    }
  })

  const tasks = useTasksValue()
  const taskIndexes = useTaskIndexesValue()
  const sortedTasks = taskIndexes.concat().sort((a, b) => a.index - b.index).map((taskIndex) => {
    const task = tasks.find(($0) => $0.id === taskIndex.taskId) ?? { id: "", title: "not found", stage: "todo" }
    return task
  })

  return (
    <div css={s.colmnStyle}>
      <p css={s.titleStyle}>
        {title}
      </p>
      <Spacer size={10} />
      <Divider />
      <Spacer size={10} />

      <ul ref={drop} css={s.draggableAreaStyle}>
        {sortedTasks.map((task, index) => (
          task.stage === columnStage &&
          <DraggableTask
            id={task.id}
            title={task.title}
            index={index}
            key={task.id}
          />
        ))}
        {isProjectOwner && columnStage === "todo" &&
          <AddNewTaskDialog />
        }
      </ul>
    </div>
  )
}

export default DroppableTaskColumn