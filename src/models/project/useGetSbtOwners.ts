import { useState } from "react"
import { useFetchEffect } from "./useFetchEffect";
import { Holder, SbtOwner } from "@/types/SbtOwner";
import { useWeb3Contract } from "react-moralis";
import securitiesAbi from "../../../constants/Securities.json";
import { holdersFromMoralis } from "../firestore/dataConverter";
import { getUser } from "../firestore/getUser";

const sbtAddr = "0xa271BdAd273e282B909419d29074Ec2B56100368"

export const useGetSbtOwners = () => {

  const [sbtOwners, setSbtOwners] = useState<SbtOwner[]>([])
  const { runContractFunction: getHolders } = useWeb3Contract({
    abi: securitiesAbi,
    contractAddress: sbtAddr,
    functionName: "getHolders",
    params: {},
  });

  //get SBT owners
  useFetchEffect(async () => {
    //get sbt owners
    let holders: Holder[] = []
    try {
      const receivedHolders = await getHolders()
      holders = holdersFromMoralis(receivedHolders)
    } catch { }

    //get users
    for (let i = 0; i < holders.length; i++) {
      const holder = holders[i]
      //get user
      const { data: owner } = await getUser(holder.address)
      if (!owner) { continue }
      setSbtOwners((currentVallue) => {
        if (!currentVallue) { return currentVallue }
        return [
          ...currentVallue,
          {
            ...owner,
            address: holder.address
          }
        ]
      })
    }
  }, [], {
    skipFetch: []
  })

  return sbtOwners
}
