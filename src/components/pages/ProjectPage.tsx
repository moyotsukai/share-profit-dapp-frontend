import { Project } from "@/types/Project.type"
import Title from "../ui/Title/Title"
import { ChangeEventHandler, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { getProjectFromId } from "@/models/firestore/getProjectFromId"
import { asyncTask } from "@/utils/asyncTask"
import { useFetchEffect } from "@/models/project/useFetchEffect"

export default function ProjectPage() {

  const router = useRouter()
  const { projectId } = router.query
  const [project, setProject] = useState<Project | null>(null)
  const [isVerified, setIsVerified] = useState<boolean>(false)

  useFetchEffect(async () => {
    if (typeof projectId !== "string") { return }
    if (!projectId) { return }

    const { data } = await getProjectFromId(projectId)
    setProject(data)
  }, [projectId])

  const onChangeInvitationCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value
    if (!project) { return }
    if (text === project.invitationCode) {
      setIsVerified(true)
    }
  }

  return (
    <div>
      {project
        ? (
          <div>
            <Title>
              {project.title}
            </Title>
            {isVerified
              ? (
                <div>
                  <p>
                    Show details here
                  </p>
                </div>
              )
              : (
                <div>
                  <p>Enter invitation code to join the project</p>
                  <input
                    type="text"
                    onChange={onChangeInvitationCode}
                  />
                </div>
              )}
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
