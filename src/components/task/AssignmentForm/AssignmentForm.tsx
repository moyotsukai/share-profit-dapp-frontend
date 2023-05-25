import React, { useState } from "react"
import * as s from "./style"
import { Task } from "@/types/Task"
import Button from "@/components/ui/Button"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Title from "@/components/ui/Title"
import Spacer from "@/components/ui/Spacer"
import { updateProjectArray } from "@/models/firestore/updateProject"
import { useProjectState } from "@/states/projectState"
import { updateTaskArray } from "@/models/firestore/updateTask"
import { useUserValue } from "@/states/userState"

const formInputSchema = z
  .object({
    message: z.string()
  })

type AssignmentApplication = z.infer<typeof formInputSchema>

type Props = {
  task: Task
}

const AssignmentForm: React.FC<Props> = ({ task }) => {

  const user = useUserValue()
  const [project, setProject] = useProjectState()
  const [isApplying, setIsApplying] = useState<boolean>(false)
  const { register, handleSubmit, reset } = useForm<AssignmentApplication>({ resolver: zodResolver(formInputSchema) })
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

  const onApplyForAssignment = () => {
    setIsApplying(true)
  }

  const onCancel = () => {
    setIsApplying(false)
    reset()
  }

  const onSubmit: SubmitHandler<AssignmentApplication> = async (data) => {
    if (!user || !project) { return }
    setIsButtonEnabled(false)
    setIsButtonLoading(true)

    //update task
    // await updateTaskArray({
    //   projectId: project.id,
    //   taskId: task.id,
    //   key: "applyingForAssignmentIds",
    //   value: user.uid,
    //   method: "union"
    // })

    //update project state

    setIsApplying(false)
  }

  return (
    <>
      {!isApplying
        ? (
          <Button
            onClick={onApplyForAssignment}
            style="outlined"
          >
            Apply for Assignment
          </Button>
        )
        : (
          <div>
            <Title style="subtitle">
              Apply for Assignment
            </Title>
            <Spacer size={20} />

            <form>
              <div>
                <label>
                  <p>
                    Message
                  </p>
                </label>
                <textarea
                  placeholder="When and how you want to work on the task..."
                  {...register("message")}
                />
              </div>
              <Spacer size={20} />

              <div css={s.buttonGroupStyle}>
                <Button
                  onClick={handleSubmit(onSubmit)}
                  isEnabled={isButtonEnabled}
                  isLoading={isButtonLoading}
                  style="contained"
                >
                  Register
                </Button>
                <Spacer size={6} isVertical={false} />
                <Button
                  onClick={onCancel}
                  style="outlined"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )
      }
    </>
  )
}

export default AssignmentForm