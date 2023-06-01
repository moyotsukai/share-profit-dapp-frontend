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
import { uploadSbtImage } from "@/models/storage/uploadSbtImage"
import { updateProject } from "@/models/firestore/updateProject"
import { useNotification } from "web3uikit"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { contractAddressesInterface } from "../../../types/networkAddress"
import securitiesFactoryAbi from "../../../../constants/SecuritiesFactory.json"
import networkConfig from "../../../../constants/networkMapping.json"

const formInputSchema = z.object({
  sbtTokenName: z.string().nonempty({ message: "Required" }),
  sbtTokenSymbol: z.string().nonempty({ message: "Required" }),
  sbtImage: z.custom<FileList>().transform((data) => data[0]),
})

type NewProjectAboutSbt = z.infer<typeof formInputSchema>

export default function NewProjectAboutSbtPage() {
  const router = useRouter()

  // TODO: uriを生成する処理を実装
  const uri = "ipfs://QmUnzswTarW8fVUH6aztH8h4sqoxuBCDyTnBrwvU4Z4T4d"
  const { chainId } = useMoralis()
  const addresses: contractAddressesInterface = networkConfig
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const securitiesFactoryAddr = chainId ? addresses[chainString].SecuritiesFactory[0] : undefined

  const [editingProject, setEditingProject] = useEditingProjectState()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  const [sbtAddr, setSbtAddr] = useState<string>("")
  usePageLeaveConfirmation(isPageLeaveAllowed)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewProjectAboutSbt>({ resolver: zodResolver(formInputSchema) })
  const dispatch = useNotification()

  const { runContractFunction: deploy } = useWeb3Contract({
    abi: securitiesFactoryAbi,
    contractAddress: securitiesFactoryAddr,
    functionName: "deploy",
    params: {
      _uri: uri,
    },
  })
  const handleDeployContractsSuccess = async (tx: any) => {
    const txReceipt = await tx.wait()
    setSbtAddr(txReceipt.events[0].address)
    dispatch({
      type: "success",
      message: "contract deployed",
      title: "deploy contract!",
      position: "topR",
    })
  }

  const addSbtImageFromFormData = async ({
    data,
    projectId,
  }: {
    data: NewProjectAboutSbt
    projectId?: string
  }) => {
    if (!data.sbtImage) {
      return null
    }
    if (!projectId) {
      return null
    }

    const { data: sbtImageUrl } = await uploadSbtImage({
      projectId: projectId,
      file: data.sbtImage,
    })
    if (!sbtImageUrl) {
      return null
    }

    await updateProject({
      projectId: projectId,
      project: { sbtImageUrl: sbtImageUrl },
    })

    return sbtImageUrl
  }

  const onSubmit: SubmitHandler<NewProjectAboutSbt> = async (data) => {
    setIsButtonEnabled(false)
    setIsButtonLoading(true)
    setIsPageLeaveAllowed(true)

    //upload image, get url
    if (!editingProject || !editingProject?.id) {
      return
    }
    const sbtImageUrl = await addSbtImageFromFormData({
      data: data,
      projectId: editingProject.id,
    })

    //set editing project globally
    if (sbtImageUrl) {
      setEditingProject({
        ...editingProject,
        sbtImageUrl: sbtImageUrl,
        sbtTokenName: data.sbtTokenName,
        sbtTokenSymbol: data.sbtTokenSymbol,
      })
    } else {
      setEditingProject({
        ...editingProject,
        sbtTokenName: data.sbtTokenName,
        sbtTokenSymbol: data.sbtTokenSymbol,
      })
    }

    // TODO
    // <<<Hashimoto
    // deploy SBT contract
    await deploy({
      onSuccess: handleDeployContractsSuccess,
      onError: (error) => console.log(error),
    })
    // Hashimoto>>>

    router.push(PATHS.NEW_PROJECT.ABOUT_VAULT)
  }

  return (
    <div>
      <Title>Setting up SBT</Title>
      <Spacer size={30} />

      <p>[About SBT here]</p>
      <Spacer size={20} />

      <form>
        <div>
          <label>
            <p>Token name</p>
            <input type="text" {...register("sbtTokenName")} />
            {errors.sbtTokenName && <ErrorMessage>{errors.sbtTokenName?.message}</ErrorMessage>}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>Token symbol</p>
            <input type="text" {...register("sbtTokenSymbol")} />
            {errors.sbtTokenSymbol && (
              <ErrorMessage>{errors.sbtTokenSymbol?.message}</ErrorMessage>
            )}
          </label>
        </div>
        <Spacer size={20} />

        <div>
          <label>
            <p>Token image</p>
          </label>
          <input type="file" accept=".jpg, .jpeg, .png" {...register("sbtImage")} />
          {errors.sbtImage && <ErrorMessage>{errors.sbtImage?.message}</ErrorMessage>}
        </div>
        <Spacer size={20} />

        <Button
          onClick={handleSubmit(onSubmit)}
          isEnabled={isButtonEnabled}
          isLoading={isButtonLoading}
          style="outlined"
        >
          Set up SBT and go next
        </Button>
      </form>
    </div>
  )
}
