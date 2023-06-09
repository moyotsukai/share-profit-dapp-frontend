import * as s from "./style";
import React from "react"
import { SbtOwner } from "@/types/SbtOwner";
import Spacer from "@/components/ui/Spacer";
import { Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react";
import networkConfig from "../../../../constants/networkMapping.json"
import accountAbi from "../../../../constants/Account.json"
import { ethers } from "ethers"

type Props = {
  projectTreasuryAddress: string
}

const ReceiveProceeds: React.FC<Props> = ({ projectTreasuryAddress }) => {
  const tokenAddr = networkConfig["80001"].Usdc[0]
  const account = useAddress()
  const { contract: accountContaract } = useContract(projectTreasuryAddress, accountAbi)
  const { data: releasableToken } = useContractRead(accountContaract, "releasableToken", [
    tokenAddr,
    account,
  ])

  return (
    <div>
      <p>Unreceived Proceeds</p>
      {releasableToken ? (
        <div>{ethers.utils.formatEther(parseInt(releasableToken as string))} USDC</div>
      ) : (
        <div>0.0 USDC</div>
      )}

      <Spacer size={60} />
      <p>Receive Proceeds</p>
      <Web3Button
        contractAddress={projectTreasuryAddress}
        contractAbi={accountAbi}
        action={(contract) => {
          contract.call("withdrawToken", [tokenAddr])
        }}
        onError={(error) => console.log(error)}
      >
        Withdraw USDC
      </Web3Button>
    </div>
  )
}

export default ReceiveProceeds
