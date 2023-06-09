import Button from "@/components/ui/Button"
import Spacer from "@/components/ui/Spacer"
import Title from "@/components/ui/Title"
import ErrorMessage from "@/components/ui/ErrorMessage"
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { ChangeEvent, useState } from "react"
import { useRouter } from "next/router"
import { PATHS } from "../paths"
import { usePageLeaveConfirmation } from "@/models/project/usePageLeaveConfirmation"
import { useEditingProjectState } from "@/states/editingProjectState"
import securitiesFactoryAbi from "../../../../constants/SecuritiesFactory.json"
import networkConfig from "../../../../constants/networkMapping.json"
import { SmartContract, Web3Button, useStorageUpload } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import { updateProject } from "@/models/firestore/updateProject"

const formInputSchema = z.object({
  sbtTokenName: z.string().nonempty({ message: "Required" }),
  sbtImage: z.custom<FileList>().transform((data) => data[0]),
})

type NewProjectAboutSbt = z.infer<typeof formInputSchema>

export default function NewProjectAboutSbtPage() {
  const router = useRouter()
  const metadataTemplate = {
    name: "",
    description: "",
    image: "",
  }

  // sbt factory address
  const sbtFactoryAddr = networkConfig["80001"].SecuritiesFactory[0]
  const { mutateAsync: upload } = useStorageUpload()

  const [editingProject, setEditingProject] = useEditingProjectState()
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isPageLeaveAllowed, setIsPageLeaveAllowed] = useState<boolean>(false)
  usePageLeaveConfirmation(isPageLeaveAllowed)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<NewProjectAboutSbt>({ resolver: zodResolver(formInputSchema) })

  const onDeploySbt = async (contract: SmartContract<ethers.BaseContract>) => {
    setIsPageLeaveAllowed(true)
    const sbtTokenName = getValues("sbtTokenName")
    const sbtImage = getValues("sbtImage")
    console.log("AAA")
    const uri = await uploadToIpfs({ tokenName: sbtTokenName, tokenImage: sbtImage })
    console.log("uri", uri)
    const tx = await contract.call("deploy", [uri])
    console.log("tx", tx)
    const sbtAddress = tx.receipt.events[0].address as string
    console.log("sbtAddress", sbtAddress)

    await handleSubmit(onSubmit)

    console.log("BBB")
    await updateProjectData({ sbtTokenName: sbtTokenName, sbtAddress: sbtAddress })
    console.log("CCC")

    router.push(PATHS.NEW_PROJECT.ABOUT_VAULT)
  }

  const onSubmit: SubmitHandler<NewProjectAboutSbt> = async (data) => {
    setIsButtonEnabled(false)
    setIsPageLeaveAllowed(true)

    //upload image, get url
    if (!editingProject || !editingProject?.id) {
      return
    }

    //set editing project globally
    setEditingProject({
      ...editingProject,
      sbtTokenName: data.sbtTokenName,
    })
  }

  // SBTのmetadataの作成
  const uploadToIpfs = async ({
    tokenName,
    tokenImage,
  }: {
    tokenName: string
    tokenImage: File
  }) => {
    var uri: string | null = null
    if (tokenImage) {
      const uploadUri = await upload({
        data: [tokenImage],
        options: { uploadWithoutDirectory: true },
      })
      uri = uploadUri[0]
    } else {
      uri = "ipfs://QmTsfF3METLsEikk6DsJuRtdcaEoRXvzG94d7vE9bWQ4ib"
    }

    let tokenUriMetadata = { ...metadataTemplate }
    tokenUriMetadata.name = tokenName
    tokenUriMetadata.description = "test uploading to ipfs"
    tokenUriMetadata.image = uri
    const tokenUri = await upload({
      data: [tokenUriMetadata],
      options: { uploadWithoutDirectory: true },
    })
    console.log(tokenUri[0])
    return tokenUri[0]
  }

  const updateProjectData = async ({
    sbtTokenName,
    sbtAddress,
  }: {
    sbtTokenName: string
    sbtAddress: string
  }) => {
    if (!editingProject || !editingProject?.id) {
      return
    }
    // update project
    await updateProject({
      projectId: editingProject.id,
      project: {
        sbtTokenName: sbtTokenName,
        sbtAddress: sbtAddress,
      },
    })
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
            <p>Token image</p>
          </label>
          <input type="file" accept=".jpg, .jpeg, .png" {...register("sbtImage")} />
          {errors.sbtImage && <ErrorMessage>{errors.sbtImage?.message}</ErrorMessage>}
        </div>
        <Spacer size={20} />

        {/* <Button
          onClick={handleSubmit(onSubmit)}
          isEnabled={isButtonEnabled}
          isLoading={isButtonLoading}
          style="outlined"
        >
          Set up SBT and go next
        </Button> */}
        <Web3Button
          contractAddress={sbtFactoryAddr}
          contractAbi={securitiesFactoryAbi}
          action={onDeploySbt}
          onError={(error) => console.log(error)}
          isDisabled={!isButtonEnabled}
        >
          Deploy SBT
        </Web3Button>
      </form>
    </div>
  )
}
