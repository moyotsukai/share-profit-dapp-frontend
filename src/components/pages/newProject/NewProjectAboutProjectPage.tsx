import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../../ui/Button"
import { createProject } from "@/models/firestore/createProject"
import { Project } from "@/types/Project.type"
import { useRouter } from "next/router"
import { useUserValue } from "@/states/userState"
import { useSetEditingProjectState } from "@/states/editingProjectState"
import { PATHS } from "../paths"
import { randomDigits } from "@/utils/randomDigits"
import { uploadProjectImage } from "@/models/storage/uploadProjectImage"
import { updateProject } from "@/models/firestore/updateProject"

const formInputSchema = z
  .object({
    title: z
      .string()
      .nonempty({ message: "Required" }),
    image: z
      .custom<FileList>(),
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
  .transform((data) => {
    const selectedImage = data.image[0]
    return {
      ...data,
      selectedImage
    }
  })

type NewProjectAboutProject = z.infer<typeof formInputSchema>

export default function NewProjectAboutProjectPage() {

  const router = useRouter()
  const user = useUserValue()
  const setEditingProjectState = useSetEditingProjectState()
  const { register, handleSubmit, formState, formState: { errors } } = useForm<NewProjectAboutProject>({ resolver: zodResolver(formInputSchema) })

  const createProjectFromFormData = async (data: NewProjectAboutProject) => {
    console.log("create project method")
    if (!user || !user.uid) { return null }

    const invitationCode = randomDigits(4)

    const project: Project = {
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
      lastModifiedAt: new Date()
    }

    const { data: projectId } = await createProject(project)
    if (!projectId) { return null }
    project.id = projectId

    return project
  }

  const addProjectImageFromFormData = async ({ data, projectId }: { data: NewProjectAboutProject, projectId?: string }) => {
    if (!data.selectedImage) { return null }
    if (!projectId) { return null }

    const { data: projectImageUrl } = await uploadProjectImage({ projectId: projectId, file: data.selectedImage })

    if (!projectImageUrl) { return null }

    await updateProject({ imageUrl: projectImageUrl })
  }

  const onSubmit: SubmitHandler<NewProjectAboutProject> = async (data) => {
    //set project data to firestore
    const project = await createProjectFromFormData(data)

    if (!project) { return }

    //post image, get url, and update project doc
    await addProjectImageFromFormData({ data: data, projectId: project.id })

    //set editing project globally
    setEditingProjectState(project)

    //go to next page
    router.push(PATHS.NEW_PROJECT.ABOUT_SBT)
  }

  return (
    <div>
      <p>New project</p>

      <form>
        <label>Project name</label>
        <input type="text" {...register("title")} />
        {errors.title && (
          <p>{errors.title?.message}</p>
        )}

        <div>
          <label>Cover image</label>
          <input type="file" accept=".jpg, .jpeg, .png" {...register("image")} />
          {errors.image && (
            <p>{errors.image?.message}</p>
          )}
        </div>

        <div>
          <label>Details</label>
          <input type="text" {...register("details")} />
          {errors.details && (
            <p>{errors.details?.message}</p>
          )}
        </div>

        <div>
          <label>Twitter</label>
          <input type="text" {...register("twitterUrl")} />
          {errors.twitterUrl && (
            <p>{errors.twitterUrl?.message}</p>
          )}
        </div>

        <div>
          <label>Discord</label>
          <input type="text" {...register("discordUrl")} />
          {errors.discordUrl && (
            <p>{errors.discordUrl?.message}</p>
          )}
        </div>

        <div>
          <label>Founder&apos;s share of the profit</label>
          <input type="number" {...register("ownerProfitShare", { valueAsNumber: true })} />
          {errors.ownerProfitShare &&
            <p>{errors.ownerProfitShare?.message}</p>
          }
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          isEnabled={formState.isValid}
          isLoading={false}
        >
          Create and go next
        </Button>
      </form>
    </div>
  )
}
