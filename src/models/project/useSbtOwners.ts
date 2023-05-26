import { useState } from "react"
import { useFetchEffect } from "./useFetchEffect";
import { Holder, SbtOwner } from "@/types/SbtOwner";
import { useWeb3Contract } from "react-moralis";
import securitiesAbi from "../../../constants/Securities.json";
import { useMembersState } from "@/states/membersState";
import { holdersFromMoralis } from "../firestore/dataConverter";
import { getUser } from "../firestore/getUser";

const sbtAddr = "0xa271BdAd273e282B909419d29074Ec2B56100368"

export const useSbtOwners = () => {

  const [sbtOwners, setSbtOwners] = useState<SbtOwner[]>([])
  const { runContractFunction: getHolders } = useWeb3Contract({
    abi: securitiesAbi,
    contractAddress: sbtAddr,
    functionName: "getHolders",
    params: {},
  });
  const [members, setMembers] = useMembersState()

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
      const alreadyFetchedMember = members.find(($0) => $0.uid === holder.address)
      if (alreadyFetchedMember) {
        //skip if already fetched user
        setSbtOwners((currentValue) => {
          if (!currentValue) { return currentValue }
          return [
            ...currentValue,
            {
              ...alreadyFetchedMember,
              address: holder.address
            }
          ]
        })
      } else {
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
        setMembers((currentValue) => {
          return [
            ...currentValue,
            owner
          ]
        })
      }
    }
  }, [])

  return sbtOwners
}
