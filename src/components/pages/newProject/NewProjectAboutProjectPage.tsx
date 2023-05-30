import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../ui/Button"
import { createProject } from "@/models/firestore/createProject"
import { EditingProject } from "@/types/Project"
import { useRouter } from "next/router"
import { useUserValue } from "@/states/userState"
import { useSetEditingProjectState } from "@/states/editingProjectState"
import { PATHS } from "../paths"
import { uploadProjectImage } from "@/models/storage/uploadProjectImage"
import { updateProject } from "@/models/firestore/updateProject"
import { useState } from "react"
import ErrorMessage from "@/components/ui/ErrorMessage"
import Spacer from "@/components/ui/Spacer"
import Title from "@/components/ui/Title"
import { usePageLeaveConfirmation } from "@/models/project/usePageLeaveConfirmation"
import { randomCharactors } from "@/utils/randomCharactors"

const formInputSchema = z
  .object({
    title: z
      .string()
      .nonempty({ message: "Required" }),
    image: z
      .custom<FileList>()
      .transform((data) => data[0]),
    details: z
      .string(),
    twitterUrl: z
      .string()
      .url({ message: "Invalid URL" })
      .or(z.literal("")),
    discordUrl: z
      .string()
      .url({ message: "Invalid URL" })
      .or(z.literal("")),
    ownerProfitShare: z
      .number()
      .int({ message: "Value must be an integer" })
      .min(0, { message: "Value must be between 0 and 100" })
      .max(100, { message: "Value must be between 0 and 100" }),
  })

type NewProjectAboutProject = z.infer<typeof formInputSchema>

export default function NewProjectAboutProjectPage() {

  const router = useRouter()
  const user = useUserValue()
  const setEditingProject = useSetEditingProjectState()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  usePageLeaveConfirmation(isPageLeaveAllowed)
  const { register, handleSubmit, formState: { errors } } = useForm<NewProjectAboutProject>({ resolver: zodResolver(formInputSchema) })

  const createProjectFromFormData = async (data: NewProjectAboutProject) => {
    if (!user || !user.uid) { return null }

    const invitationCode = randomCharactors(6)

    const project: EditingProject = {
      title: data.title,
      details: data.details,
      twitterUrl: data.twitterUrl,
      discordUrl: data.discordUrl,
      ownerProfitShare: data.ownerProfitShare,
      invitationCode: invitationCode,
      state: "uncompleted",
      createdBy: user.uid,
      ownerIds: [user.uid],
      memberIds: [],
      tasks: [],
      taskIndexes: [],
      lastModifiedAt: new Date()
    }

    const { data: createdProject } = await createProject(project)
    if (!createdProject) { return null }

    return createdProject
  }

  const addProjectImageFromFormData = async ({ data, projectId }: { data: NewProjectAboutProject, projectId: string }) => {
    if (!data.image) { return null }
    if (!projectId) { return null }

    const { data: projectImageUrl } = await uploadProjectImage({ projectId: projectId, file: data.image })

    if (!projectImageUrl) { return null }

    const { data: _, error } = await updateProject({ projectId: projectId, project: { imageUrl: projectImageUrl } })
    if (error) { return null }

    return projectImageUrl
  }

  const onSubmit: SubmitHandler<NewProjectAboutProject> = async (data) => {
    setIsButtonEnabled(false)
    setIsButtonLoading(true)
    setIsPageLeaveAllowed(true)

    //set project data to firestore
    const project = await createProjectFromFormData(data)
    if (!project) { return }

    //post image, get url, and update project doc
    const projectImageUrl = await addProjectImageFromFormData({ data: data, projectId: project.id })

    //set editing project globally
    if (projectImageUrl) {
      setEditingProject({
        ...project,
        imageUrl: projectImageUrl
      })
    } else {
      setEditingProject({
        ...project
      })
    }

    //go to next page
    router.push(PATHS.NEW_PROJECT.ABOUT_SBT)
  }

  return (
    <div>
      <Title>
        New project
      </Title>
      <Spacer size={30} />

      <form>
        <div>
          <label>
            <p>
              Project name
            </p>
            <input type="text" {...register("title")} />
            {errors.title && (
              <ErrorMessage>
                {errors.title?.message}
              </ErrorMessage>
            )}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>
              Cover image
            </p>
          </label>
          <input type="file" accept=".jpg, .jpeg, .png" {...register("image")} />
          {errors.image && (
            <ErrorMessage>
              {errors.image?.message}
            </ErrorMessage>
          )}
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>
              Details
            </p>
            <textarea {...register("details")} />
            {errors.details && (
              <ErrorMessage>
                {errors.details?.message}
              </ErrorMessage>
            )}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>
              Twitter
            </p>
            <input type="text" {...register("twitterUrl")} />
            {errors.twitterUrl && (
              <ErrorMessage>
                {errors.twitterUrl?.message}
              </ErrorMessage>
            )}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>
              Discord
            </p>
            <input type="text" {...register("discordUrl")} />
            {errors.discordUrl && (
              <ErrorMessage>
                {errors.discordUrl?.message}
              </ErrorMessage>
            )}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>
              Founder&apos;s share of the profit
            </p>
            <input type="number" {...register("ownerProfitShare", { valueAsNumber: true })} />
            {errors.ownerProfitShare &&
              <ErrorMessage>
                {errors.ownerProfitShare?.message}
              </ErrorMessage>
            }
          </label>
        </div>
        <Spacer size={20} />

        <Button
          onClick={handleSubmit(onSubmit)}
          isEnabled={isButtonEnabled}
          isLoading={isButtonLoading}
          style="outlined"
        >
          Create and go next
        </Button>
      </form>
    </div>
  )
}
