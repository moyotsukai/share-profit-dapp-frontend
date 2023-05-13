import Button from "@/components/ui/Button"
import Spacer from "@/components/ui/Spacer"
import Title from "@/components/ui/Title"
import ErrorMessage from "@/components/ui/ErrorMessage"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { useRouter } from "next/router"
import { PATHS } from "../paths"
import { usePageLeaveConfirmation } from "@/models/project/usePageLeaveConfirmation"
import { useEditingProjectState } from "@/states/editingProjectState"
import { Project } from "@/types/Project.type"

const formInputSchema = z
  .object({
    sbtTokenName: z
      .string()
      .nonempty({ message: "Required" }),
    sbtTokenSymbol: z
      .string()
      .nonempty({ message: "Required" }),
    sbtImage: z
      .custom<FileList>()
      .transform((data) => data[0])
  })

type NewProjectAboutSbt = z.infer<typeof formInputSchema>

export default function NewProjectAboutSbtPage() {

  const router = useRouter()
  const [editingProject, setEditingProject] = useEditingProjectState()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  usePageLeaveConfirmation(isPageLeaveAllowed)
  const { register, handleSubmit, formState: { errors } } = useForm<NewProjectAboutSbt>({ resolver: zodResolver(formInputSchema) })

  const onSubmit: SubmitHandler<NewProjectAboutSbt> = async (data) => {
    setIsButtonEnabled(false)
    setIsButtonLoading(true)
    setIsPageLeaveAllowed(true)

    //TODO
    //upload image, get url

    const projectAboutSbt: Partial<Project> = {
      sbtImageUrl: "",
      sbtTokenName: data.sbtTokenName,
      sbtTokenSymbol: data.sbtTokenSymbol
    }

    if (!editingProject) { return }
    setEditingProject({
      ...editingProject,
      ...projectAboutSbt
    })
    console.log({
      ...editingProject,
      ...projectAboutSbt
    })

    //TODO
    //update firestore doc

    router.push(PATHS.NEW_PROJECT.ABOUT_VAULT)
  }

  return (
    <div>
      <Title>
        Setting up SBT
      </Title>
      <Spacer size={30} />

      <p>
        [About SBT here]
      </p>
      <Spacer size={20} />

      <form>
        <div>
          <label>
            <p>
              Token name
            </p>
            <input type="text" {...register("sbtTokenName")} />
            {errors.sbtTokenName && (
              <ErrorMessage>
                {errors.sbtTokenName?.message}
              </ErrorMessage>
            )}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>
              Token symbol
            </p>
            <input type="text" {...register("sbtTokenSymbol")} />
            {errors.sbtTokenSymbol && (
              <ErrorMessage>
                {errors.sbtTokenSymbol?.message}
              </ErrorMessage>
            )}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>
              Token image
            </p>
          </label>
          <input type="file" accept=".jpg, .jpeg, .png" {...register("sbtImage")} />
          {errors.sbtImage && (
            <ErrorMessage>
              {errors.sbtImage?.message}
            </ErrorMessage>
          )}
        </div>
        <Spacer size={20} />

        <Button
          onClick={handleSubmit(onSubmit)}
          isEnabled={isButtonEnabled}
          isLoading={isButtonLoading}
          style="outlined"
        >
          Set up and go Next
        </Button>
      </form>
    </div>
  )
}