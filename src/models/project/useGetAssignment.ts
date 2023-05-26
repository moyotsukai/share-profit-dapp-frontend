import { useState } from "react"
import { useFetchEffect } from "./useFetchEffect";
import { useUserValue } from "@/states/userState";
import { getAssignmentApplicationFromId } from "../firestore/getAssignmentApplicationFromId";
import { LocalAssignmentApplication } from "@/types/assignmentApplication";
import { LocalSubmission } from "@/types/submission";
import { getSubmissionFromId } from "../firestore/getSubmissionFromId";
import { Project } from "@/types/Project";
import { useMembersState } from "@/states/membersState";
import { getUser } from "../firestore/getUser";

export const useGetAssignment = (project: Project | null | undefined) => {

  const user = useUserValue()
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false)
  const [assignmentApplications, setAssignmentApplications] = useState<LocalAssignmentApplication[]>([])
  const [submissions, setSubmissions] = useState<LocalSubmission[]>([])
  const [members, setMembers] = useMembersState()

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

        //get users for assignment applications
        const alreadyFetchedMembers = members.find(($0) => $0.uid === assignmentApplication.userId)
        if (alreadyFetchedMembers) {
          //skip if already fetched user
          setAssignmentApplications((currentValue) => [
            ...currentValue,
            {
              ...assignmentApplication,
              user: alreadyFetchedMembers
            }
          ])
        } else {
          //get user
          const { data: userData } = await getUser(assignmentApplication.userId)
          if (!userData) { continue }
          setAssignmentApplications((currentValue) => [
            ...currentValue,
            {
              ...assignmentApplication,
              user: userData
            }
          ])
          setMembers((currentValue) => {
            return [
              ...currentValue,
              userData
            ]
          })
        }
      }

      //get submissions
      const allSubmissionIds: string[] = project.tasks.map((task) => task.submissionIds).flat()
      for (let i = 0; i < allSubmissionIds.length; i++) {
        const submissionId = allSubmissionIds[i]
        const { data: submission } = await getSubmissionFromId(submissionId)
        if (!submission) { continue }

        //get users for assignment applications
        const alreadyFetchedMembers = members.find(($0) => $0.uid === submission.userId)
        if (alreadyFetchedMembers) {
          //skip if already fetched user
          setSubmissions((currentValue) => [
            ...currentValue,
            {
              ...submission,
              user: alreadyFetchedMembers
            }
          ])
        } else {
          //get user
          const { data: userData } = await getUser(submission.userId)
          if (!userData) { continue }
          setSubmissions((currentValue) => [
            ...currentValue,
            {
              ...submission,
              user: userData
            }
          ])
          setMembers((currentValue) => {
            return [
              ...currentValue,
              userData
            ]
          })
        }
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
