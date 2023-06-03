import { useFetchEffect } from "./useFetchEffect";
import { useUserValue } from "@/states/userState";
import { getAssignmentApplicationFromId } from "../firestore/getAssignmentApplicationFromId";
import { getSubmissionFromId } from "../firestore/getSubmissionFromId";
import { Project } from "@/types/Project";
import { useSubmissionsState } from "@/states/submissionsState";
import { useAssignmentApplicationsState } from "@/states/assignmentApplicatinsState";

export const useGetAssignment = (project: Project | null | undefined) => {

  const user = useUserValue()
  const [assignmentApplications, setAssignmentApplications] = useAssignmentApplicationsState()
  const [submissions, setSubmissions] = useSubmissionsState()

  //get project
  useFetchEffect(async () => {
    if (!user || !project || !project.tasks) { return }

    //get assignment applications
    const allAssignmentApplicationIds: string[] = project.tasks.map((task) => task.assignmentApplicationIds).flat()
    for (let i = 0; i < allAssignmentApplicationIds.length; i++) {
      const assignmentApplicationId = allAssignmentApplicationIds[i]
      const { data: assignmentApplication } = await getAssignmentApplicationFromId(assignmentApplicationId)

      if (!assignmentApplication) { continue }

      //set assignment applications
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


  }, [user, project], {
    skipFetch: [!user, !project, !project?.tasks]
  })

  return {
    assignmentApplications,
    submissions,
  }
}
