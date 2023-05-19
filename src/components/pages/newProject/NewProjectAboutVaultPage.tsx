import Button from "@/components/ui/Button"
import Spacer from "@/components/ui/Spacer"
import Title from "@/components/ui/Title"
import { updateProject } from "@/models/firestore/updateProject"
import { usePageLeaveConfirmation } from "@/models/project/usePageLeaveConfirmation"
import { useEditingProjectValue } from "@/states/editingProjectState"
import { useRouter } from "next/router"
import { useState } from "react"
import { PATHS } from "../paths"

export default function NewProjectAboutVaultPage() {

  const router = useRouter()
  const editingProject = useEditingProjectValue()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  usePageLeaveConfirmation(isPageLeaveAllowed)

  const onClickComplete = async () => {
    setIsButtonEnabled(false)
    setIsButtonLoading(true)
    setIsPageLeaveAllowed(true)

    //TODO
    //<<<Hashimoto
    //金庫コントラクト作成

    //get 金庫のaddress

    const address = ""
    //Hashimoto>>>

    if (!editingProject || !editingProject.id) { return }
    const { error } = await updateProject({
      projectId: editingProject.id,
      project: {
        ...editingProject,
        vaultAddress: "",
        state: "ongoing",
        lastModifiedAt: new Date()
      }
    })
    if (error) { return }

    //go to project page
    router.push(PATHS.PROJECT(editingProject.id))
  }

  return (
    <div>
      <Title>
        Creating vault contract for the project
      </Title>
      <Spacer size={30} />

      <p>
        [About vault here]
      </p>
      <Spacer size={20} />

      <p>
        SBT address
      </p>
      <p>
        [SBT address here]
      </p>
      <Spacer size={20} />

      <Button
        onClick={onClickComplete}
        isEnabled={isButtonEnabled}
        isLoading={isButtonLoading}
        style="contained"
      >
        Deploy and complete project
      </Button>
    </div>
  )
}