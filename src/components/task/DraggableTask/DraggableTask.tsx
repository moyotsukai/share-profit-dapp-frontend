import React, { useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import * as s from "./style"
import { DropResult } from "../DroppableTaskColumn/DroppableTaskColumn"
import { useSetProjectState } from "@/states/projectState"

type DraggableTask = {
  id: string,
  index: number
}

type Props = {
  id: string,
  title: string,
  index: number
}

const DraggableTask: React.FC<Props> = ({ id, title, index }) => {

  const ref = useRef<HTMLLIElement>(null)
  const setProject = useSetProjectState()

  const [, drag] = useDrag<DraggableTask>({
    type: "item",
    item: { id, index },
    end: (_, monitor) => {
      //drag and drop between columns
      const dropResult = monitor.getDropResult() as DropResult

      if (dropResult) {
        setProject((currentProject) => {
          if (!currentProject) { return currentProject }
          const currentTasks = currentProject.tasks
          const newTasks = currentTasks.map((task) => {
            if (task.id === id) {
              return {
                ...task,
                stage: dropResult.taskStage
              }
            } else {
              return task
            }
          })
          return { ...currentProject, tasks: newTasks }
        })
      }
    }
  })

  const [, drop] = useDrop<DraggableTask>({
    accept: ["item"],
    drop: (item) => {
      //sorting within the same column
      const fromIndex = item.index
      const newIndex = index

      setProject((currentProject) => {
        if (!currentProject) { return currentProject }
        const currentTaskIndexes = currentProject.taskIndexes
        const newTaskIndexes = currentTaskIndexes.map((currentTaskIndex) => {
          const index = currentTaskIndex.index
          if (newIndex < fromIndex) {
            if (index < newIndex) { return currentTaskIndex }
            if (index > fromIndex) { return currentTaskIndex }
            if (index === fromIndex) {
              return { ...currentTaskIndex, index: newIndex }
            }
            return { ...currentTaskIndex, index: currentTaskIndex.index + 1 }
          }

          if (newIndex > fromIndex) {
            if (index > newIndex) { return currentTaskIndex }
            if (index < fromIndex) { return currentTaskIndex }
            if (index === fromIndex) {
              return { ...currentTaskIndex, index: newIndex }
            }
            return { ...currentTaskIndex, index: currentTaskIndex.index - 1 }
          }

          return currentTaskIndex
        })
        return { ...currentProject, taskIndexes: newTaskIndexes }
      })
    }
  })

  drag(drop(ref))

  return (
    <li
      ref={ref}
      css={s.taskStyle}
    >
      <p>
        {title}
      </p>
    </li>
  )
}

export default DraggableTask