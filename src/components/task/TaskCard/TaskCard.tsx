import React, { useState } from "react"
import * as s from "./style"
import { Task, taskStageDisplayText } from "@/types/Task"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/router"
import { useFetchEffect } from "@/models/project/useFetchEffect"
import AssignmentForm from "../AssignmentForm"
import Spacer from "@/components/ui/Spacer"

type Props = {
  task: Task
}

const TaskCard: React.FC<Props> = ({ task }) => {

  const router = useRouter()
  const { taskId } = router.query
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  useFetchEffect(() => {
    if (taskId === task.id) {
      setIsDialogOpen(true)
    }
  }, [], {
    skipFetch: []
  })

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Dialog.Trigger asChild>
        <button css={s.taskCardStyle}>
          {task.title}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay css={s.dialogOverlayStyle} />
        <Dialog.Content css={s.dialogContentStyle}>
          <div css={s.titleContainerStyle}>
            <Dialog.Title>
              {task.title}
            </Dialog.Title>
            <div css={s.closeButtonSpacerStyle} />
            <Dialog.Close asChild>
              <button aria-label="Close" css={s.closeButtonStyle}>
                x
              </button>
            </Dialog.Close>
          </div>

          <div>
            <p>
              {taskStageDisplayText(task.stage)}
            </p>
            {task.outline && (
              <p>
                {task.outline}
              </p>
            )}
            <p>
              {task.details}
            </p>
            <p>
              {`${task.bountySbt} tokens`}
            </p>
            {!task.asigneeIds.length
              && !task.assignmentApplicationIds.length
              &&
              <>
                <Spacer size={30} />
                <AssignmentForm task={task} />
              </>
            }

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default TaskCard