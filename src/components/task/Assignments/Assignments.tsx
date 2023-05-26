import React from "react"
import * as s from "./style"
import Title from "@/components/ui/Title"
import Spacer from "@/components/ui/Spacer"
import { Submission } from "@/types/submission"
import { AssignmentApplication } from "@/types/assignmentApplication"
import { Task } from "@/types/Task"

type Props = {
  assignmentApplications: AssignmentApplication[],
  submissions: Submission[],
  tasks: Task[]
}

const Assignments: React.FC<Props> = ({ assignmentApplications, submissions, tasks }) => {

  //TODO
  //リストアイテムをAssignmentApplicationApprovalDialog, submissionApprovalDialogに切り出す
  return (
    <div>
      <Title style="subtitle">
        Task Assignment Applicatoins
      </Title>
      <ul>
        {assignmentApplications.map((assignmentApplication, index) => (
          <li key={index}>
            <p>
              {tasks.find(($0) => $0.id === assignmentApplication.taskId)?.title ?? ""}
            </p>
            <p>
              {assignmentApplication.user.name}
            </p>
          </li>
        ))}
      </ul>
      <Spacer size={30} />

      <Title style="subtitle">
        Task Submissions
      </Title>
      <ul>
        {submissions.map((submission, index) => (
          <li key={index}>
            <p>
              {tasks.find(($0) => $0.id === submission.userId)?.title ?? ""}
            </p>
            <p>
              {submission.user.name}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Assignments