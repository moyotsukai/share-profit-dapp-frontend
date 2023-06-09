import { useState } from "react"
import { useFetchEffect } from "./useFetchEffect"
import { Holder, SbtOwner } from "@/types/SbtOwner"
import securitiesAbi from "../../../constants/Securities.json"
import { holdersFromChain } from "../firestore/dataConverter"
import { getUser } from "../firestore/getUser"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { getProjectFromId } from "../firestore/getProjectFromId"

export const useGetSbtHolders = (sbtAddress: string) => {
  const [sbtOwners, setSbtOwners] = useState<SbtOwner[]>([])
  const { contract: sbtContract } = useContract(sbtAddress, securitiesAbi)
  const { data: sbtHolders, error: getHoldersError } = useContractRead(sbtContract, "getHolders")
  if (getHoldersError) {
    console.error(getHoldersError)
  }

  //get SBT holders
  useFetchEffect(
    async () => {
      //get sbt holders
      let holders: Holder[] = []
      try {
        const receivedHolders = sbtHolders
        holders = holdersFromChain(receivedHolders)
      } catch {}

      //get users
      for (let i = 0; i < holders.length; i++) {
        const holder = holders[i]
        //get user
        const { data: owner } = await getUser(holder.address)
        if (!owner) {
          continue
        }
        setSbtOwners((currentValue) => {
          if (!currentValue) {
            return currentValue
          }
          return [
            ...currentValue,
            {
              ...owner,
              address: holder.address,
            },
          ]
        })
      }
    },
    [],
    {
      skipFetch: [],
    }
  )

  return sbtOwners
}
