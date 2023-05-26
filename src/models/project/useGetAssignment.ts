import { useState } from "react"
import { useFetchEffect } from "./useFetchEffect";
import { useUserValue } from "@/states/userState";
import { getAssignmentApplicationFromId } from "../firestore/getAssignmentApplicationFromId";
import { AssignmentApplication } from "@/types/assignmentApplication";
import { Submission } from "@/types/submission";
import { getSubmissionFromId } from "../firestore/getSubmissionFromId";
import { Project } from "@/types/Project";

export const useGetAssignment = (project: Project | null | undefined) => {

  const user = useUserValue()
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false)
  const [assignmentApplications, setAssignmentApplications] = useState<AssignmentApplication[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])

  //get project
  useFetchEffect(async () => {
    //get assignment applications
    if (!user || !project || !project.tasks) { return }
    if (project.ownerIds.includes(user.uid)) {
      setIsProjectOwner(true)
      const allAssignmentApplicationIds: string[] = project.tasks.map((task) => task.assignmentApplicationIds).flat()
      for (let i = 0; i < allAssignmentApplicationIds.length; i++) {
        const assignmentApplicationId = allAssignmentApplicationIds[i]
        const { data } = await getAssignmentApplicationFromId(assignmentApplicationId)
        if (!data) { continue }
        setAssignmentApplications((currentValue) => [...currentValue, data])
      }

      //get submissions
      const allSubmissionIds: string[] = project.tasks.map((task) => task.submissionIds).flat()
      for (let i = 0; i < allSubmissionIds.length; i++) {
        const submissionId = allSubmissionIds[i]
        const { data } = await getSubmissionFromId(submissionId)
        if (!data) { continue }
        setSubmissions((currentValue) => [...currentValue, data])
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
    submissions
  }
}
