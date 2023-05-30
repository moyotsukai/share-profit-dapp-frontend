import { Project } from "@/types/Project.type"
import Title from "../ui/Title/Title"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getProjectFromId } from "@/models/firestore/getProjectFromId"
import { useFetchEffect } from "@/models/project/useFetchEffect"
import Link from "next/link"
import TabBar from "../radix/TabBar"
import { useUserValue } from "@/states/userState"
import { updateProjectArray } from "@/models/firestore/updateProject"
import LoadingCircle from "../ui/LoadingCircle/LoadingCircle"
import { downloadImageFromUrl } from "@/models/storage/downloadProjectImage"
import { Avatar } from "../radix/Avatar/Avatar"
import { SbtOwner } from "@/types/SbtOwner.type"
import { useMoralis, useWeb3Contract } from "react-moralis"
import securitiesAbi from "../../../constants/Securities.json"
import TaskBoard from "../task/TaskBoard"
import Assignments from "../task/Assignments";
import ProjectOverview from "../project/ProjectOverview/ProjectOverview";
import SbtOwners from "../project/SbtOwners";
import { useGetSbtOwners } from "@/models/project/useGetSbtOwners";
import { useGetProject } from "@/models/project/useGetProject";
import { useGetAssignment } from "@/models/project/useGetAssignment";

export default function ProjectPage() {

  const sbtAddr = "0xa271BdAd273e282B909419d29074Ec2B56100368"
  const router = useRouter()
  const { projectId, taskId } = router.query
  const user = useUserValue()
  const [project, setProject] = useState<Project | null | undefined>(undefined)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false)
  const { project } = useGetProject(projectId)
  const { isProjectOwner, assignmentApplications, submissions } = useGetAssignment(project)
  const sbtOwners = useGetSbtOwners()
  const [_, setProjectIdQueryString] = useState<string>("")
    
  const { runContractFunction: getHolders } = useWeb3Contract({
    abi: securitiesAbi,
    contractAddress: sbtAddr,
    functionName: "getHolders",
    params: {},
  })

  useEffect(() => {
    setProjectIdQueryString((currentValue) => {
      if (typeof projectId !== "string") { return currentValue }
      if (!projectId) { return currentValue }
      if (currentValue && projectId !== currentValue) {
        router.reload()
      }
      return projectId
    })
  }, [projectId])

  //set if user needs to enter invitation code
  useEffect(() => {
    if (!project || !user) { return }
    if (isProjectOwner) {
      setIsVerified(true)
    } else {
      setIsVerified(project.memberIds.includes(user.uid))
    }
  }, [project, user, isProjectOwner])

  //get SBT owners
  useFetchEffect(async () => {
    //TODO
    //Hashimoto
    //get sbt owners
    const owners: SbtOwner[] = (await getHolders()) as SbtOwner[]

    //set sbt owner state
    setSbtOwners(owners)
  }, [])

  const onChangeInvitationCode = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    if (!project) { return }
    if (!user) { return }

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
            <div>
              {project.downloadImageUrl ? (
                <div>
                  <Avatar
                    src={project.downloadImageUrl}
                    alt="project icon"
                    fallback={project.title.substring(0, 1)}
                  />
                </div>
              ) : (
                <div>
                  <Avatar fallback={project.title.substring(0, 1)} />
                </div>
              )}
              <p>{project.title}</p>
            </div>

            <TabBar.List>
              <TabBar.Trigger value="overview">Overview</TabBar.Trigger>
              <TabBar.Trigger value="tasks">Tasks</TabBar.Trigger>
              <TabBar.Trigger value="sbt-owners">SBT owners</TabBar.Trigger>
              {isProjectOwner &&
                <TabBar.Trigger value="assignments">Assignments</TabBar.Trigger>
              }
            </TabBar.List>

            <TabBar.Content value="overview">
              <ProjectOverview
                project={project}
                isProjectOwner={isProjectOwner}
              />
            </TabBar.Content>

            <TabBar.Content value="tasks">
              <TaskBoard />
            </TabBar.Content>

            <TabBar.Content value="sbt-owners">
              <SbtOwners sbtOwners={sbtOwners} />
            </TabBar.Content>

            {isProjectOwner &&
              <TabBar.Content value="assignments">
                <Assignments
                  assignmentApplications={assignmentApplications}
                  submissions={submissions}
                  tasks={project.tasks}
                />
              </TabBar.Content>
            }
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
