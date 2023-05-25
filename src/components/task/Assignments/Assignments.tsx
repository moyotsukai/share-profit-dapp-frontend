import React, { useState } from "react"
import * as s from "./style"
import Title from "@/components/ui/Title"
import Spacer from "@/components/ui/Spacer"
import { AssignmentApplication } from "@/types/assignmentApplication"
import { Submission } from "@/types/submission"

type Props = {
  assignmentApplications: AssignmentApplication[],
  submissions: Submission[]
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
              {assignmentApplication.taskId}
            </p>
            <p>
              {assignmentApplication.userId}
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
              {submission.taskId}
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