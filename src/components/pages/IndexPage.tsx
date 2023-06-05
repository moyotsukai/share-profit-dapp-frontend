import { useState } from "react"
import TabBar from "../radix/TabBar"
import Button from "../ui/Button"
import Spacer from "../ui/Spacer/Spacer"
import { useFetchEffect } from "@/models/project/useFetchEffect"
import accountAbi from "../../../constants/Account.json"
import networkConfig from "../../../constants/networkMapping.json"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import ProjectSearch from "../project/ProjectSearch"

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
  const dispatch = useNotification()

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
          <ProjectSearch />
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
