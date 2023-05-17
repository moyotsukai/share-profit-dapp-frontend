import { Project } from "@/types/Project.type"
import Title from "../ui/Title/Title"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { getProjectFromId } from "@/models/firestore/getProjectFromId"
import { useFetchEffect } from "@/models/project/useFetchEffect"
import Link from "next/link"
import Image from "next/image"
import TabBar from "../radix/TabBar"
import { useUserValue } from "@/states/userState"
import { updateProjectArray } from "@/models/firestore/updateProject"
import LoadingCircle from "../ui/LoadingCircle/LoadingCircle"

export default function ProjectPage() {

  const router = useRouter()
  const { projectId } = router.query
  const user = useUserValue()
  const [project, setProject] = useState<Project | null | undefined>(undefined)
  const [isVerified, setIsVerified] = useState<boolean>(false)
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false)

  useFetchEffect(async () => {
    if (typeof projectId !== "string") { return }
    if (!projectId) { return }

    const { data } = await getProjectFromId(projectId)
    setProject(data)

    //TODO
    //setProject globally
  }, [projectId])

  useEffect(() => {
    if (!project || !user) { return }
    if (project.ownerIds.includes(user.uid)) {
      setIsProjectOwner(true)
      setIsVerified(true)
    } else {
      project.memberIds.includes(user.uid)
    }
  }, [project, user])

  const onChangeInvitationCode = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    if (!project) { return }
    if (!user) { return }
    if (text === project.invitationCode) {
      setIsVerified(true)
      console.log(project)
      const { error } = await updateProjectArray({
        projectId: project.id,
        key: "memberIds",
        value: user.uid,
        method: "union"
      })
      console.log(error)
    }
  }

  return (
    <div>
      {project
        ? (
          isVerified
            ? (
              <TabBar.Root defaultValue="overview">
                <div>
                  {project.imageUrl &&
                    <div>
                      <Image src={""} alt="project icon" />
                    </div>
                  }
                  <p>
                    {project.title}
                  </p>
                </div>

                <TabBar.List>
                  <TabBar.Trigger value="overview">
                    Overview
                  </TabBar.Trigger>
                  <TabBar.Trigger value="tasks">
                    Tasks
                  </TabBar.Trigger>
                  <TabBar.Trigger value="sbt-owners">
                    SBT owners
                  </TabBar.Trigger>
                </TabBar.List>

                <TabBar.Content value="overview">
                  <div>
                    {isProjectOwner &&
                      <div>
                        <p>
                          Share the following information with project members.
                        </p>
                        <p>
                          Invitation code
                        </p>
                        <p>
                          {project.invitationCode}
                        </p>
                      </div>
                    }
                    {project.twitterUrl &&
                      <div>
                        <Link href={project.twitterUrl}>
                          Twitter
                        </Link>
                      </div>
                    }
                    {project.discordUrl &&
                      <div>
                        <Link href={project.discordUrl}>
                          Discord
                        </Link>
                      </div>
                    }
                    {project.details &&
                      <div>
                        <p>
                          {project.details}
                        </p>
                      </div>
                    }
                    <div>
                      <p>
                        Project vault address
                      </p>
                      <p>
                        {project.vaultAddress}
                      </p>
                    </div>
                  </div>
                </TabBar.Content>

                <TabBar.Content value="tasks">
                  <p>List tasks here</p>
                </TabBar.Content>

                <TabBar.Content value="sbt-owners">
                  <p>Show SBT owners here</p>
                </TabBar.Content>
              </TabBar.Root>
            )
            : (
              <div>
                <p>
                  Enter invitation code
                </p>
                <input
                  type="text"
                  onChange={onChangeInvitationCode}
                />
              </div>
            )
        )
        : project === undefined
          ? (
            <div>
              <p>Loading</p>
              <LoadingCircle />
            </div>
          )
          : (
            <div>
              <Title>
                Project not found
              </Title>
            </div>
          )
      }
    </div>
  )
}
