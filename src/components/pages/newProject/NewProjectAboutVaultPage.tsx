import Button from "@/components/ui/Button"
import Spacer from "@/components/ui/Spacer"
import Title from "@/components/ui/Title"
import { updateProject } from "@/models/firestore/updateProject"
import { usePageLeaveConfirmation } from "@/models/project/usePageLeaveConfirmation"
import { useEditingProjectValue } from "@/states/editingProjectState"
import { useRouter } from "next/router"
import { useState } from "react"
import { PATHS } from "../paths"
import factoryAbi from "../../../../constants/Factory.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { contractAddressesInterface } from "../../../types/networkAddress"
import networkConfig from "../../../../constants/networkMapping.json"

export default function NewProjectAboutVaultPage() {
  const { chainId } = useMoralis()
  const addresses: contractAddressesInterface = networkConfig
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const factoryAddr = chainId ? addresses[chainString].Factory[0] : undefined
  const adminAddr = "0x8eBD4fAa4fcEEF064dCaEa48A3f75d0D0A3ba3f2"
  // TODO: uriを生成する処理を実装
  const uri = "ipfs://QmUnzswTarW8fVUH6aztH8h4sqoxuBCDyTnBrwvU4Z4T4d"
  // TODO: フォームから取得
  const founderShare = 1
  const dispatch = useNotification()

  const router = useRouter()
  const editingProject = useEditingProjectValue()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [sbtAddr, setSbtAddr] = useState<string>("")
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  const [vaultAddr, setVaultAddr] = useState<string>("")
  usePageLeaveConfirmation(isPageLeaveAllowed)

  const { runContractFunction: deploy } = useWeb3Contract({
    abi: factoryAbi,
    contractAddress: factoryAddr,
    functionName: "deploy",
    params: {
      _adminAddr: adminAddr,
      _uri: uri,
      _share: founderShare,
    },
  })
  const handleDeployContractsSuccess = async (tx: any) => {
    const txReceipt = await tx.wait()
    setSbtAddr(txReceipt.events[0].address)
    setVaultAddr(txReceipt.events[1].address)
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

    //TODO
    //<<<Hashimoto
    //金庫コントラクト、Sbtコントラクト作成
    const addrs = await deploy({
      onSuccess: handleDeployContractsSuccess,
      onError: (error) => console.log(error),
    })

    //Hashimoto>>>

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
