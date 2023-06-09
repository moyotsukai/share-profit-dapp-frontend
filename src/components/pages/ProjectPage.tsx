import Title from "../ui/Title/Title"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import TabBar from "../radix/TabBar"
import { useUserValue } from "@/states/userState"
import { updateProjectArray } from "@/models/firestore/updateProject"
import LoadingCircle from "../ui/LoadingCircle/LoadingCircle"
import TaskBoard from "../task/TaskBoard"
import Assignments from "../task/Assignments"
import ProjectOverview from "../project/ProjectOverview/ProjectOverview"
import SbtOwners from "../project/SbtOwners"
import { useGetSbtHolders } from "@/models/project/useGetSbtOwners"
import { useGetProject } from "@/models/project/useGetProject"
import { useGetAssignment } from "@/models/project/useGetAssignment"

export default function ProjectPage() {

  const router = useRouter()
  const { projectId, taskId } = router.query
  const user = useUserValue()
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const { project } = useGetProject(projectId)
  const sbtHolders = useGetSbtHolders(project?.sbtAddress ?? "")
  const { assignmentApplications, submissions } = useGetAssignment(project)
  const isProjectOwner = useIsProjectOwner(project)
  const sbtOwners = useGetSbtOwners()
  const [_, setProjectIdQueryString] = useState<string>("")

  useEffect(() => {
    setProjectIdQueryString((currentValue) => {
      if (typeof projectId !== "string") {
        return currentValue
      }
      if (!projectId) {
        return currentValue
      }
      if (currentValue && projectId !== currentValue) {
        router.reload()
      }
      return projectId
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  //set if user needs to enter invitation code
  useEffect(() => {
    if (!project || !user) {
      return
    }
    if (isProjectOwner) {
      setIsVerified(true)
    } else {
      setIsVerified(project.memberIds.includes(user.uid))
    }
  }, [project, user, isProjectOwner])

  const onChangeInvitationCode = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    if (!project) {
      return
    }
    if (!user) {
      return
    }

    if (text === project.invitationCode) {
      setIsVerified(true)
      await updateProjectArray({
        projectId: project.id,
        key: "memberIds",
        value: user.uid,
        method: "union",
      })
    }
  }

  return (
    <div>
      {project ? (
        isVerified ? (
          <TabBar.Root defaultValue={taskId ? "tasks" : "overview"}>
            <ProjectHeader project={project} />

            <TabBar.List>
              <TabBar.Trigger value="overview">Overview</TabBar.Trigger>
              <TabBar.Trigger value="tasks">Tasks</TabBar.Trigger>
              <TabBar.Trigger value="sbt-owners">SBT owners</TabBar.Trigger>
              {isProjectOwner && <TabBar.Trigger value="assignments">Assignments</TabBar.Trigger>}
            </TabBar.List>

            <TabBar.Content value="overview">
              <ProjectOverview project={project} isProjectOwner={isProjectOwner} />
            </TabBar.Content>

            <TabBar.Content value="tasks">
              <TaskBoard />
            </TabBar.Content>

            <TabBar.Content value="sbt-owners">
              <SbtOwners sbtOwners={sbtHolders} />
            </TabBar.Content>

            {isProjectOwner && (
              <TabBar.Content value="assignments">
                <Assignments
                  assignmentApplications={assignmentApplications}
                  submissions={submissions}
                  tasks={project.tasks}
                />
              </TabBar.Content>
            )}
          </TabBar.Root>
        ) : (
          <div>
            <p>Enter invitation code</p>
            <input type="text" onChange={onChangeInvitationCode} />
          </div>
        )
      ) : project === undefined ? (
        <div>
          <p>Loading</p>
          <LoadingCircle />
        </div>
      ) : (
        <div>
          <Title>Project not found</Title>
        </div>
      )}
    </div>
  )
}
