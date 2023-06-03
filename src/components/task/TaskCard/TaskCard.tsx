import React, { useState } from "react"
import * as s from "./style"
import { Task, taskStageDisplayText } from "@/types/Task"
import * as Dialog from "@radix-ui/react-dialog"
import { useRouter } from "next/router"
import { useFetchEffect } from "@/models/project/useFetchEffect"
import AssignmentForm from "../AssignmentForm"
import Spacer from "@/components/ui/Spacer"
import { useUserValue } from "@/states/userState"
import SubmissionForm from "../SubmissionForm/SubmissionForm"
import { useSubmissionsValue } from "@/states/submissionsState"
import { useAssignmentApplicationsValue } from "@/states/assignmentApplicatinsState"
import Title from "@/components/ui/Title/Title"
import { assignmentApplicationStageDisplayText } from "@/types/assignmentApplication"
import { submissionStageDisplayText } from "@/types/submission"

type Props = {
  task: Task
}

const TaskCard: React.FC<Props> = ({ task }) => {

  const user = useUserValue()
  const router = useRouter()
  const { taskId } = router.query
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const isUsersCard = (user && task.asigneeIds.includes(user.uid)) ?? false
  const assignmentApplications = useAssignmentApplicationsValue()
  const submissions = useSubmissionsValue()
  const assignmentApplicationsForThisTask = assignmentApplications.filter(($0) => $0.taskId === task.id)
  //only one person can apply for assignment
  const noOneHasAppliedForTask = !task.asigneeIds.length
    && !task.assignmentApplicationIds.length
  const isAssignmentFormAvailable = noOneHasAppliedForTask && !assignmentApplicationsForThisTask.find(($0) => $0.userId === user?.uid)
  const submissionsForThisTask = submissions.filter(($0) => $0.taskId === task.id)
  const isSubmissionFormAvailable = isUsersCard && !submissionsForThisTask.find(($0) => $0.userId === user?.uid)

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
        <button css={() => s.taskCardStyle(isUsersCard)}>
          <p>
            {task.title}
          </p>
          {assignmentApplicationsForThisTask.map((assignmentApplication, index) => (
            <p key={index}>
              @{assignmentApplication.user.name}
            </p>
          ))}
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

            {assignmentApplicationsForThisTask.length !== 0 &&
              <>
                <Spacer size={30} />
                <Title style="subtitle">
                  Assignments
                </Title>
                {assignmentApplicationsForThisTask.map((assignmentApplication, index) => (
                  <p key={index}>
                    {`@${assignmentApplication.user.name} (${assignmentApplicationStageDisplayText(assignmentApplication.stage)})`}
                  </p>
                ))}
              </>
            }

            {isAssignmentFormAvailable &&
              <>
                <Spacer size={30} />
                <AssignmentForm task={task} />
              </>
            }

            {submissionsForThisTask.length !== 0 &&
              <>
                <Spacer size={30} />
                <Title style="subtitle">
                  Submissions
                </Title>
                {submissionsForThisTask.map((submission, index) => (
                  <p key={index}>
                    {`@${submission.user.name} (${submissionStageDisplayText(submission.stage)})`}
                  </p>
                ))}
              </>
            }

            {isSubmissionFormAvailable &&
              <>
                <Spacer size={30} />
                <SubmissionForm task={task} />
              </>
            }

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default TaskCard