import { useEffect, useState } from "react"
import TabBar from "../radix/TabBar"
import Button from "../ui/Button"
import Spacer from "../ui/Spacer/Spacer"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProjectArray } from "@/models/firestore/updateProject"
import { useRouter } from "next/router"
import { PATHS } from "./paths"
import { getProjectsWhere } from "@/models/firestore/getProjectsWhere"
import { KEYS } from "@/models/firestore/keys"
import accountAbi from "../../../constants/Account.json"
import networkConfig from "../../../constants/networkMapping.json"
import { ethers } from "ethers"
import { Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { useUserValue } from "@/states/userState"
import { useFetchEffect } from "@/models/project/useFetchEffect"
import ProjectSearch from "../project/ProjectSearch"

const formInputSchema = z.object({
  enteredText: z.string().nonempty(),
})

type SearchProject = z.infer<typeof formInputSchema>

export default function IndexPage() {
  const user = useUserValue()
  // TODO: projectごとに取得
  // const { data: project } = await getProjectFromId("")
  // const treasuryAddress = project.vaultAddress
  const accountAddr = "0x327A554A478B091A0AED63E2F63b700f0A3181fe"
  const tokenAddr = networkConfig["80001"].Usdc[0]
  const account = useAddress()

  const router = useRouter()
  const { register, handleSubmit } = useForm<SearchProject>({
    resolver: zodResolver(formInputSchema),
  })
  const [isWithdrawalButtonClickable, setWithdrawalButtonClickable] = useState<boolean>(false)

  // get the amount of unreceived token
  const { contract: accountContaract } = useContract(accountAddr, accountAbi)
  const { data: releasableToken } = useContractRead(accountContaract, "releasableToken", [
    tokenAddr,
    account,
  ])

  const onClickSearch: SubmitHandler<SearchProject> = async (data) => {
    //get projects where invitatoin code matches
    const { data: projects } = await getProjectsWhere({
      key: KEYS.PROJECT.INVITATION_CODE,
      operation: "==",
      value: data.enteredText,
    })
    if (!projects || !projects.length) {
      return
    }
    const project = projects[0]

    //add user.uid to member ids
    if (!account) {
      return
    }
    await updateProjectArray({
      projectId: project.id,
      key: "memberIds",
      value: account,
      method: "union",
    })

    //go to project page
    router.push(PATHS.PROJECT(project.id))
  }

  const onEnterDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return
    }
    handleSubmit(onClickSearch)
  }

  useFetchEffect(
    async () => {
      if (!user) {
        return
      }
      const { data: usersProjects } = await getProjectsWhere({
        key: KEYS.PROJECT.MEMBER_IDS,
        operation: "array-contains",
        value: user.uid,
      })
      if (!usersProjects) {
        return
      }
      // tokenを合算
    },
    [user],
    {
      skipFetch: [!user],
    }
  )

  return (
    <div>
      <TabBar.Root defaultValue="projects">
        <TabBar.List>
          <TabBar.Trigger value="projects">Projects</TabBar.Trigger>
          <TabBar.Trigger value="revenue">Balance</TabBar.Trigger>
        </TabBar.List>

        <TabBar.Content value="projects">
          <ProjectSearch />
        </TabBar.Content>

        <TabBar.Content value="revenue">
          <p>Unreceived distribution balance</p>
          {releasableToken ? (
            <div>{ethers.utils.formatEther(parseInt(releasableToken as string))} USDC</div>
          ) : (
            <div>0.0 USDC</div>
          )}
          <Spacer size={60} />
          <p>Receive distribution</p>
          {/* <Button
            onClick={onClickReceiveDistribution}
            isEnabled={isWithdrawalButtonClickable}
            isLoading={false}
          >
            Receive distribution
          </Button> */}
          <Web3Button
            contractAddress={accountAddr}
            contractAbi={accountAbi}
            action={(contract) => {
              contract.call("withdrawToken", [tokenAddr])
            }}
            onError={(error) => console.log(error)}
            isDisabled={!isWithdrawalButtonClickable}
          >
            Withdraw USDC
          </Web3Button>
        </TabBar.Content>
      </TabBar.Root>
    </div>
  )
}
