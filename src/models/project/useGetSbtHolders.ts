import { useEffect, useState } from "react"
import { useFetchEffect } from "./useFetchEffect"
import { Holder, SbtOwner } from "@/types/SbtOwner"
import securitiesAbi from "../../../constants/Securities.json"
import { holdersFromChain } from "../firestore/dataConverter"
import { getUser } from "../firestore/getUser"
import { ethers } from "ethers"
import { useUserValue } from "@/states/userState"

export const useGetSbtHolders = (sbtAddress: string) => {
  const [sbtOwners, setSbtOwners] = useState<SbtOwner[]>([])
  const user = useUserValue()

  const getHolders = async () => {
    const contract = new ethers.Contract(sbtAddress, securitiesAbi, user?.provider)
    const sbtHolders = await contract.getHolders()
    console.log("holders", sbtHolders)
    return sbtHolders
  }
  console.log("sbtAddress", sbtAddress)
  useEffect(() => {
    getHolders()
  }, [])

  //get SBT holders
  useFetchEffect(
    async () => {
      //get sbt holders
      let holders: Holder[] = []
      try {
        const receivedHolders = await getHolders()
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
