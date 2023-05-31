import React, { Dispatch, SetStateAction, useState } from "react"
import * as s from "./style"
import * as Dialog from "@radix-ui/react-dialog"
import { useProjectState, useSetProjectState } from "@/states/projectState"
import { AssignmentApplication } from "@/types/assignmentApplication"
import { Task } from "@/types/Task"
import Button from "@/components/ui/Button"
import Spacer from "@/components/ui/Spacer"
import { updateTask, updateTaskArray } from "@/models/firestore/updateTask"
import { updateAssignmentApplication } from "@/models/firestore/updateAssignmentApplication"
import { Submission } from "@/types/submission"
import { useSetAssignmentApplicationsState } from "@/states/assignmentApplicatinsState"
import { useSetSubmissionsState } from "@/states/submissionsState"
import { updateProjectArray } from "@/models/firestore/updateProject"

type Props = {
  type: "assignmentApplication" | "submission",
  assignment: AssignmentApplication | Submission,
  tasks: Task[]
}

const AssignmentApprovalDialog: React.FC<Props> = ({ type, assignment, tasks }: Props) => {

  const task = tasks.find(($0) => $0.id === assignment.taskId)
  const setProject = useSetProjectState()
  const setAssignmentApplications = useSetAssignmentApplicationsState()
  const setSubmissions = useSetSubmissionsState()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

  const onApprove = async () => {
    if (!task) { return }
    setIsButtonEnabled(false)
    setIsButtonLoading(true)

    if (type === "assignmentApplication") {
      //assignment application
      await updateTask({
        projectId: assignment.projectId,
        taskId: task.id,
        task: { stage: "inProgress" }
      })

      await updateAssignmentApplication({
        assignmentApplicationId: assignment.id,
        assignmentApplication: { stage: "accepted" }
      })

      //set project state
      setProject((currentValue) => {
        if (!currentValue) { return currentValue }
        const newTasks: Task[] = currentValue.tasks.map(($0) => {
          if ($0.id === task.id) {
            return { ...$0, stage: "inProgress" }
          } else {
            return $0
          }
        })
        return {
          ...currentValue,
          tasks: newTasks
        }
      })
      //ここはSWRのmutatorで書き換える
      setAssignmentApplications((currentValue) => {
        const newAssignmentApplications: AssignmentApplication[] = currentValue.map(($0) => {
          if ($0.id === task.id) {
            return { ...$0, stage: "accepted" }
          } else {
            return $0
          }
        })
        return newAssignmentApplications
      })

    } else {
      //submission
      await updateTask({
        projectId: assignment.projectId,
        taskId: task.id,
        task: { stage: "done" }
      })

      await updateAssignmentApplication({
        assignmentApplicationId: assignment.id,
        assignmentApplication: { stage: "accepted" }
      })

      //set project state
      setProject((currentValue) => {
        if (!currentValue) { return currentValue }
        const newTasks: Task[] = currentValue.tasks.map(($0) => {
          if ($0.id === task.id) {
            return { ...$0, stage: "done" }
          } else {
            return $0
          }
        })
        return {
          ...currentValue,
          tasks: newTasks
        }
      })
      //ここはSWRのmutatorで書き換える
      setSubmissions((currentValue) => {
        const newSubmissions: Submission[] = currentValue.map(($0) => {
          if ($0.id === task.id) {
            return { ...$0, stage: "accepted" }
          } else {
            return $0
          }
        })
        return newSubmissions
      })
    }

    setIsDialogOpen(false)
    setIsButtonEnabled(true)
    setIsButtonLoading(false)
  }

  const onReject = async () => {
    if (!task) { return }
    setIsButtonEnabled(false)
    setIsButtonLoading(true)

    if (type === "assignmentApplication") {
      //assignment application
      await updateTask({
        projectId: assignment.projectId,
        taskId: task.id,
        task: { stage: "todo" }
      })

      await updateAssignmentApplication({
        assignmentApplicationId: assignment.id,
        assignmentApplication: { stage: "rejected" }
      })

      await updateTaskArray({
        projectId: assignment.projectId,
        taskId: task.id,
        key: "assignmentApplicationIds",
        value: assignment.id,
        method: "remove"
      })

      //set project state
      setProject((currentValue) => {
        if (!currentValue) { return currentValue }
        const newTasks: Task[] = currentValue.tasks.map(($0) => {
          if ($0.id === task.id) {
            return { ...$0, stage: "todo" }
          } else {
            return $0
          }
        })
        return {
          ...currentValue,
          tasks: newTasks
        }
      })
      //ここはSWRのmutatorで書き換える
      setAssignmentApplications((currentValue) => {
        const newAssignmentApplications: AssignmentApplication[] = currentValue.map(($0) => {
          if ($0.id === task.id) {
            return { ...$0, stage: "rejected" }
          } else {
            return $0
          }
        })
        return newAssignmentApplications
      })

    } else {
      //submission
      await updateAssignmentApplication({
        assignmentApplicationId: assignment.id,
        assignmentApplication: { stage: "rejected" }
      })

      //set project state
      //ここはSWRのmutatorで書き換える
      setSubmissions((currentValue) => {
        const newSubmissions: Submission[] = currentValue.map(($0) => {
          if ($0.id === task.id) {
            return { ...$0, stage: "rejected" }
          } else {
            return $0
          }
        })
        return newSubmissions
      })
    }

    setIsDialogOpen(false)
    setIsButtonEnabled(true)
    setIsButtonLoading(false)
  }

  return (
    <li>
      {task &&
        <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <Dialog.Trigger asChild>
            <button css={s.addNewTaskButtonStyle}>
              <p>
                {task.title}
              </p>
              <p>
                {assignment.user.name}
              </p>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay css={s.dialogOverlayStyle} />
            <Dialog.Content css={s.dialogContentStyle} >
              <div css={s.titleContainerStyle}>
                <Dialog.Title >
                  {task.title}
                </Dialog.Title>
                <div css={s.closeButtonSpacerStyle} />
                <Dialog.Close asChild>
                  <button aria-label="Close" css={s.closeButtonStyle}>
                    x
                  </button>
                </Dialog.Close>
              </div>

              <div css={s.buttonGroupStyle}>
                <Button
                  onClick={onApprove}
                  isEnabled={isButtonEnabled}
                  isLoading={isButtonLoading}
                >
                  Approve
                </Button>
                <Spacer size={6} isVertical={false} />
                <Button
                  onClick={onReject}
                  style="outlined"
                  isEnabled={isButtonEnabled}
                  isLoading={isButtonLoading}
                >
                  Reject
                </Button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      }
    </li>
  )
}

export default AssignmentApprovalDialog