import React from "react"
import * as s from "./style"
import Title from "@/components/ui/Title"
import Spacer from "@/components/ui/Spacer"
import { LocalAssignmentApplication } from "@/types/assignmentApplication"
import { LocalSubmission } from "@/types/submission"

type Props = {
  assignmentApplications: LocalAssignmentApplication[],
  submissions: LocalSubmission[]
}

const Assignments: React.FC<Props> = ({ assignmentApplications, submissions }) => {

  return (
    <div>
      <Title style="subtitle">
        Task Assignment Applicatoins
      </Title>
      <ul>
        {assignmentApplications.map((assignmentApplication, index) => (
          <li key={index}>
            <p>
              {assignmentApplication.user.name}
            </p>
            <p>
              {assignmentApplication.taskId}
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
              {submission.user.name}
            </p>
            <p>
              {submission.userId}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Assignments