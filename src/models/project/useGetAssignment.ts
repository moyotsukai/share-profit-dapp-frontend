import { useState } from "react"
import { useFetchEffect } from "./useFetchEffect";
import { useUserValue } from "@/states/userState";
import { getAssignmentApplicationFromId } from "../firestore/getAssignmentApplicationFromId";
import { getSubmissionFromId } from "../firestore/getSubmissionFromId";
import { Project } from "@/types/Project";
import { useAssignmentApplilcationsState } from "@/states/assignmentApplicatinsState";
import { useSubmissionsState } from "@/states/submissionsState";

export const useGetAssignment = (project: Project | null | undefined) => {

  const user = useUserValue()
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false)
  const [assignmentApplications, setAssignmentApplications] = useAssignmentApplilcationsState()
  const [submissions, setSubmissions] = useSubmissionsState()

  //get project
  useFetchEffect(async () => {
    //get assignment applications
    if (!user || !project || !project.tasks) { return }
    if (project.ownerIds.includes(user.uid)) {
      setIsProjectOwner(true)

      const allAssignmentApplicationIds: string[] = project.tasks.map((task) => task.assignmentApplicationIds).flat()
      for (let i = 0; i < allAssignmentApplicationIds.length; i++) {
        const assignmentApplicationId = allAssignmentApplicationIds[i]
        const { data: assignmentApplication } = await getAssignmentApplicationFromId(assignmentApplicationId)

        if (!assignmentApplication) { continue }

        setAssignmentApplications((currentValue) => [
          ...currentValue,
          assignmentApplication
        ])
      }

      //get submissions
      const allSubmissionIds: string[] = project.tasks.map((task) => task.submissionIds).flat()
      for (let i = 0; i < allSubmissionIds.length; i++) {
        const submissionId = allSubmissionIds[i]
        const { data: submission } = await getSubmissionFromId(submissionId)
        if (!submission) { continue }

        //set submissions
        setSubmissions((currentValue) => [
          ...currentValue,
          submission
        ])
      }

    } else {
      setIsProjectOwner(false)
    }
  }, [user, project], {
    skipFetch: [!user, !project, !project?.tasks]
  })

  return {
    isProjectOwner,
    assignmentApplications,
    submissions,
  }
}
