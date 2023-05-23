import React from "react"
import * as s from "./style"
import DroppableTaskColumn from "../DroppableTaskColumn/DroppableTaskColumn"
import * as ScrollArea from "@radix-ui/react-scroll-area"

const TaskBoard: React.FC = () => {

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