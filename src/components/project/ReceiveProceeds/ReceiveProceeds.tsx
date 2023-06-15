import * as s from "./style"
import React, { useContext, useState } from "react"
import Spacer from "@/components/ui/Spacer"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import networkConfig from "../../../../constants/networkMapping.json"
import accountAbi from "../../../../constants/Account.json"
import { ethers } from "ethers"
import { contractAddressesInterface } from "@/types/networkAddress"
import { ChainId } from "@biconomy/core-types"
import { useUserValue } from "@/states/userState"
import Button from "@/components/ui/Button"
import { SmartAccountContext } from "@/components/auth/AuthProvider"

type Props = {
  projectTreasuryAddress: string
}

const ReceiveProceeds: React.FC<Props> = ({ projectTreasuryAddress }) => {
  const { smartAccount } = useContext(SmartAccountContext)

  const [isWithdrawalButtonClickable, setIsWithdrawalButtonClickable] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const addresses: contractAddressesInterface = networkConfig
  const chainString = ChainId.POLYGON_MUMBAI.toString()
  const tokenAddr = addresses[chainString].Usdc[0]
  const user = useUserValue()

  const { contract: accountContaract } = useContract(projectTreasuryAddress, accountAbi)
  const { data: releasableToken } = useContractRead(accountContaract, "releasableToken", [
    tokenAddr,
    user?.uid,
  ])
  console.log("releasableToken: ", releasableToken)

  const getReleasableToken = async () => {
    
  }
  if (releasableToken && ethers.utils.formatUnits(parseInt(releasableToken as string)) !== "0.0") {
    setIsWithdrawalButtonClickable(false)
  }

  const onWithdrawToken = async () => {
    setIsWithdrawalButtonClickable(false)
    setIsLoading(true)
    if (!smartAccount) return
    try {
      const accountInterface = new ethers.utils.Interface(accountAbi)
      const encodedWithdrawTokenData = accountInterface.encodeFunctionData("withdrawToken", [
        tokenAddr,
      ])
      const tx = {
        to: projectTreasuryAddress,
        data: encodedWithdrawTokenData,
      }
      const txResponse = await smartAccount.sendTransaction({ transaction: tx })
      console.log("userOp hash: ", txResponse.hash)
      const txReciept = await txResponse.wait()
      console.log("Tx: ", txReciept)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <p>Unreceived Proceeds</p>
      {releasableToken ? (
        <div>{ethers.utils.formatUnits(parseInt(releasableToken as string), 6)} USDC</div>
      ) : (
        <div>0.0 USDC</div>
      )}

      <Spacer size={60} />
      <p>Receive Proceeds</p>
      <Button
        isEnabled={isWithdrawalButtonClickable}
        isLoading={isLoading}
        onClick={onWithdrawToken}
      >
        Withdraw USDC
      </Button>
    </div>
  )
}

export default ReceiveProceeds
