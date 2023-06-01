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
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { contractAddressesInterface } from "../../../types/networkAddress"
import networkConfig from "../../../../constants/networkMapping.json"

export default function NewProjectAboutVaultPage() {
  const { chainId } = useMoralis()
  const addresses: contractAddressesInterface = networkConfig
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const accounFactoryAddr = chainId ? addresses[chainString].AccountFactory[0] : undefined
  const adminAddr = "0x8eBD4fAa4fcEEF064dCaEa48A3f75d0D0A3ba3f2"
  // TODO: フォームから取得
  const founderShare = 1
  const dispatch = useNotification()

  const router = useRouter()
  const editingProject = useEditingProjectValue()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  const [vaultAddr, setVaultAddr] = useState<string>("")
  usePageLeaveConfirmation(isPageLeaveAllowed)

  const { runContractFunction: deploy } = useWeb3Contract({
    abi: accountFactoryAbi,
    contractAddress: accounFactoryAddr,
    functionName: "deploy",
    params: {
      _adminAddr: adminAddr,
      // TODO: projectごとに取得
      _securitiesAddr: "0x35Db31E08349f225bF11642694Fea5725D0792c5",
      _share: founderShare,
    },
  })
  const handleDeployContractsSuccess = async (tx: any) => {
    const txReceipt = await tx.wait()
    setVaultAddr(txReceipt.events[0].address)
    dispatch({
      type: "success",
      message: "contract deployed",
      title: "deploy contract!",
      position: "topR",
    })
  }

  const onClickComplete = async () => {
    setIsButtonEnabled(false)
    setIsButtonLoading(true)
    setIsPageLeaveAllowed(true)

    // TODO
    // <<<Hashimoto
    // deploy 金庫コントラクト
    await deploy({
      onSuccess: handleDeployContractsSuccess,
      onError: (error) => console.log(error),
    })

    // Hashimoto>>>

    if (!editingProject || !editingProject.id) {
      return
    }
    const { error } = await updateProject({
      projectId: editingProject.id,
      project: {
        ...editingProject,
        vaultAddress: "",
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
