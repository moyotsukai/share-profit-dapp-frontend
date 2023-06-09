import Button from "@/components/ui/Button"
import Spacer from "@/components/ui/Spacer"
import Title from "@/components/ui/Title"
import { updateProject } from "@/models/firestore/updateProject"
import { usePageLeaveConfirmation } from "@/models/project/usePageLeaveConfirmation"
import { useEditingProjectValue } from "@/states/editingProjectState"
import { useRouter } from "next/router"
import { useState } from "react"
import { PATHS } from "../paths"
import accountFactoryAbi from "../../../../constants/AccountFactory.json"
import networkConfig from "../../../../constants/networkMapping.json"
import { Web3Button } from "@thirdweb-dev/react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import ErrorMessage from "@/components/ui/ErrorMessage"

const formInputSchema = z.object({
  ownerProfitShare: z
    .number()
    .int({ message: "Value must be an integer" })
    .min(0, { message: "Value must be between 0 and 100" })
    .max(100, { message: "Value must be between 0 and 100" }),
})

type NewProjectAboutVault = z.infer<typeof formInputSchema>

export default function NewProjectAboutVaultPage() {
  const accountFactoryAddr = networkConfig["80001"].SecuritiesFactory[0]

  const adminAddr = "0x8eBD4fAa4fcEEF064dCaEa48A3f75d0D0A3ba3f2"

  const router = useRouter()
  const editingProject = useEditingProjectValue()
  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<NewProjectAboutVault>({ resolver: zodResolver(formInputSchema) })
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  usePageLeaveConfirmation(isPageLeaveAllowed)

  const onSuccess = async (result: any) => {
    setIsButtonEnabled(false)
    setIsPageLeaveAllowed(true)

    if (!editingProject || !editingProject.id) {
      return
    }
    const { error } = await updateProject({
      projectId: editingProject.id,
      project: {
        ...editingProject,
        vaultAddress: result.receipt.events[0].address,
        ownerProfitShare: getValues("ownerProfitShare"),
        state: "ongoing",
        lastModifiedAt: new Date(),
      },
    })
    if (error) {
      return
    }

    //go to project page
    router.push(PATHS.PROJECT(editingProject.id))
  }

  return (
    <div>
      <Title>Creating vault contract for the project</Title>
      <Spacer size={30} />

      <p>[About vault here]</p>
      <Spacer size={20} />

      <p>SBT address</p>
      <p>[SBT address here]</p>
      <Spacer size={20} />

      <div>
        <label>
          <p>Founder&apos;s share of the profit</p>
          <input type="number" {...register("ownerProfitShare", { valueAsNumber: true })} />
          {errors.ownerProfitShare && (
            <ErrorMessage>{errors.ownerProfitShare?.message}</ErrorMessage>
          )}
        </label>
      </div>
      <Spacer size={20} />

      {/* <Button
        onClick={onClickComplete}
        isEnabled={isButtonEnabled}
        isLoading={isButtonLoading}
        style="contained"
      >
        Deploy and complete project
      </Button> */}
      <Web3Button
        contractAddress={accountFactoryAddr}
        contractAbi={accountFactoryAbi}
        action={(contract) =>
          contract.call("deploy", [
            adminAddr,
            editingProject?.sbtAddress,
            getValues("ownerProfitShare"),
          ])
        }
        onSuccess={onSuccess}
        onError={(error) => console.log(error)}
        isDisabled={!isButtonEnabled}
      >
        Deploy Vault
      </Web3Button>
    </div>
  )
}
