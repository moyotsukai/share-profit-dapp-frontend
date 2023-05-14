import Button from "@/components/ui/Button"
import Spacer from "@/components/ui/Spacer"
import Title from "@/components/ui/Title"
import { usePageLeaveConfirmation } from "@/models/project/usePageLeaveConfirmation"
import { useSetEditingProjectState } from "@/states/editingProjectState"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function NewProjectAboutVaultPage() {

  const router = useRouter()
  const setEditingProjectState = useSetEditingProjectState()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  usePageLeaveConfirmation(isPageLeaveAllowed)

  useEffect(() => {
    return setEditingProjectState(null)
  }, [])

  //TODO
  //editingProjectStateとは別にnon-optionalなProjectのstateを作る？

  const onClickComplete = () => {
    setIsButtonEnabled(false)
    setIsButtonLoading(true)
    setIsPageLeaveAllowed(true)

    //TODO
    //オンチェーン処理

    //TODO
    //router push to PJ page
  }

  return (
    <div>
      <Title>
        Creating vault contract for the project
      </Title>
      <Spacer size={30} />

      <p>
        [About SBT here]
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