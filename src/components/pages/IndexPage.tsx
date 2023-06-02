import { useState } from "react"
import TabBar from "../radix/TabBar"
import Button from "../ui/Button"
import Spacer from "../ui/Spacer/Spacer"
import { z } from "zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateProjectArray } from "@/models/firestore/updateProject"
import { useRouter } from "next/router"
import { PATHS } from "./paths"
import { useFetchEffect } from "@/models/project/useFetchEffect"
import { getProjectsWhere } from "@/models/firestore/getProjectsWhere"
import { KEYS } from "@/models/firestore/keys"
import accountAbi from "../../../constants/Account.json"
import networkConfig from "../../../constants/networkMapping.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"

const formInputSchema = z.object({
  enteredText: z.string().nonempty(),
})

type SearchProject = z.infer<typeof formInputSchema>

type contractAddressesInterface = {
  [key: string]: contractAddressesItemInterface
}

type contractAddressesItemInterface = {
  [key: string]: string[]
}

export default function IndexPage() {
  const { chainId, account } = useMoralis()
  const addresses: contractAddressesInterface = networkConfig
  const chainString = chainId ? parseInt(chainId).toString() : "31337"
  const accountAddr = "0x068419813Bd03FaeeAD20370B0FB106f3A9217E4"
  const tokenAddr = (chainId && addresses[chainString] && addresses[chainString].Usdc[0]) ?? ""
  const router = useRouter()
  const dispatch = useNotification()
  const { register, handleSubmit } = useForm<SearchProject>({
    resolver: zodResolver(formInputSchema),
  })

  const [unreceivedDistributionBalance, setUnreceivedDistributionBalance] = useState<
    string | null
  >(null)

  const { runContractFunction: getReleasableBalance } = useWeb3Contract({
    abi: accountAbi,
    contractAddress: accountAddr,
    functionName: "releasableToken",
    params: {
      _token: tokenAddr,
      _addr: account,
    },
  })

  const { runContractFunction: withdrawToken } = useWeb3Contract({
    abi: accountAbi,
    contractAddress: accountAddr,
    functionName: "withdrawToken",
    params: {
      _tokenAddr: tokenAddr,
    },
  })

  //get unreceived distribution balance
  useFetchEffect(async () => {
    const releasableBalance = await getReleasableBalance()
    account
      ? releasableBalance
        ? setUnreceivedDistributionBalance(
          parseInt(
            ethers.utils.formatUnits(ethers.BigNumber.from(releasableBalance), 6)
          ).toString()
        )
        : setUnreceivedDistributionBalance("0")
      : setUnreceivedDistributionBalance(null)

    console.log(await getReleasableBalance())
  }, [], {
    skipFetch: []
  })

  const handleWithdrawSuccess = () => {
    dispatch({
      type: "success",
      message: "withdrawing proceeds",
      title: "Withdrawing!",
      position: "topR",
    })
  }

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

  const onClickReceiveDistribution = async () => {
    //分配金の残高を受け取る
    withdrawToken({
      onError: (error) => console.log(error),
      onSuccess: () => handleWithdrawSuccess(),
    })

    //表示を更新
    setUnreceivedDistributionBalance("0")
  }

  return (
    <div>
      <TabBar.Root defaultValue="projects">
        <TabBar.List>
          <TabBar.Trigger value="projects">Projects</TabBar.Trigger>
          <TabBar.Trigger value="revenue">Balance</TabBar.Trigger>
        </TabBar.List>

        <TabBar.Content value="projects">
          <form>
            <label>
              <p>Search projects</p>
              <input
                type="text"
                placeholder="Search projects..."
                onKeyDown={onEnterDown}
                {...register("enteredText")}
              />
            </label>
            <button onClick={handleSubmit(onClickSearch)}>Search</button>
          </form>
        </TabBar.Content>

        <TabBar.Content value="revenue">
          <p>Unreceived distribution balance</p>
          {unreceivedDistributionBalance !== null && (
            <p>{`${unreceivedDistributionBalance} USDC`}</p>
          )}
          <Spacer size={60} />
          <p>Receive distribution</p>
          <Button onClick={onClickReceiveDistribution} isEnabled={true} isLoading={false}>
            Receive distribution
          </Button>
        </TabBar.Content>
      </TabBar.Root>
    </div>
  )
}
