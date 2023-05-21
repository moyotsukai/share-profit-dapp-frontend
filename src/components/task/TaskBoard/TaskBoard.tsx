import React, { useEffect } from "react"
import * as s from "./style"
import DroppableTaskColumn from "../DroppableTaskColumn/DroppableTaskColumn"
import { Task, TaskIndex } from "@/types/Task"
import { useSetTasksState } from "@/states/tasksState"
import { useSetTaskIndexesState } from "@/states/taskIndexesState"
import * as ScrollArea from "@radix-ui/react-scroll-area"

const tasks: Task[] = [
  {
    id: "a",
    title: "AAA",
    stage: "todo"
  },
  {
    id: "b",
    title: "BBB",
    stage: "inProgress"
  },
  {
    id: "c",
    title: "CCC",
    stage: "inReview"
  },
  {
    id: "d",
    title: "DDD",
    stage: "done"
  },
  {
    id: "e",
    title: "EEE",
    stage: "done"
  },
  {
    id: "f",
    title: "FFF",
    stage: "done"
  },
  {
    id: "g",
    title: "GGG",
    stage: "done"
  },
  {
    id: "h",
    title: "HHH",
    stage: "done"
  },
  {
    id: "i",
    title: "III",
    stage: "done"
  },
  {
    id: "j",
    title: "JJJ",
    stage: "done"
  },
  {
    id: "k",
    title: "KKK",
    stage: "done"
  },
  {
    id: "l",
    title: "LLL",
    stage: "done"
  }
]

const taskIndexes: TaskIndex[] = [
  {
    taskId: "a",
    index: 0
  },
  {
    taskId: "b",
    index: 1
  },
  {
    taskId: "c",
    index: 2
  },
  {
    taskId: "d",
    index: 3
  },
  {
    taskId: "e",
    index: 4
  },
  {
    taskId: "f",
    index: 5
  },
  {
    taskId: "g",
    index: 6
  },
  {
    taskId: "h",
    index: 7
  },
  {
    taskId: "i",
    index: 8
  },
  {
    taskId: "j",
    index: 9
  },
  {
    taskId: "k",
    index: 10
  },
  {
    taskId: "l",
    index: 11
  },
]

const TaskBoard: React.FC = () => {

  const setTasksState = useSetTasksState()
  const setTaskIndexesState = useSetTaskIndexesState()

  //set initial state
  useEffect(() => {
    setTasksState(tasks)
    setTaskIndexesState(taskIndexes)
  }, [])

  return (
    <div css={s.containerStyle}>
      <ScrollArea.Root css={s.scrollRootStyle}>
        <ScrollArea.Viewport>
          <div css={s.boardStyle}>
            <DroppableTaskColumn
              columnStage="todo"
              title="To Do"
            />
            <DroppableTaskColumn
              columnStage="inProgress"
              title="In Progress"
            />
            <DroppableTaskColumn
              columnStage="inReview"
              title="In Review"
            />
            <DroppableTaskColumn
              columnStage="done"
              title="Done"
            />
          </div>
        </ScrollArea.Viewport>

        <ScrollArea.Scrollbar orientation="vertical">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Scrollbar orientation="horizontal">
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
    </div>
  )
}

export default TaskBoard