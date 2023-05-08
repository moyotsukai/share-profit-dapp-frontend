import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "../ui/Button"

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
      .nonempty({ message: "Required" }),
    founderProfitShare: z
      .number()
      .int({ message: "Value must be an integer" })
      .min(0, { message: "Value must be between 0 and 100" })
      .max(100, { message: "Value must be between 0 and 100" })
  })
  .transform((data) => {
    const selectedImage = data.image[0]
    return {
      ...data,
      selectedImage
    }
  })

type FormInput = z.infer<typeof formInputSchema>

export default function NewProjectPage() {

  const { register, handleSubmit, formState, formState: { errors } } = useForm<FormInput>({ resolver: zodResolver(formInputSchema) })

  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data)
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
          <input type="number" {...register("founderProfitShare", { valueAsNumber: true })} />
          {errors.founderProfitShare &&
            <p>{errors.founderProfitShare?.message}</p>
          }
        </div>

        <Button
          onClick={handleSubmit(onSubmit)}
          isEnabled={formState.isValid}
          isLoading={false}
        >
          Create project
        </Button>
      </form>
    </div>
  )
}
