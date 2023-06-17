import { useEffect, useState } from "react"
import { useFetchEffect } from "./useFetchEffect"
import { Holder, SbtOwner } from "@/types/SbtOwner"
import securitiesAbi from "../../../constants/Securities.json"
import { holdersFromChain } from "../firestore/dataConverter"
import { getUser } from "../firestore/getUser"
import { ethers } from "ethers"
import { useUserValue } from "@/states/userState"
import { useRouter } from "next/router"
import { useGetProject } from "./useGetProject"

export const useGetSbtHolders = () => {
  const router = useRouter()
  const { projectId, taskId } = router.query
  const { project } = useGetProject(projectId)
  const [sbtOwners, setSbtOwners] = useState<SbtOwner[]>([])
  const user = useUserValue()

  const getHolders = async () => {
    console.log("provider", user?.provider)
    console.log("project", project)
    console.log("sbtAddress", project?.sbtAddress)
    const contract = new ethers.Contract(project?.sbtAddress!, securitiesAbi, user?.provider)
    const sbtHolders = await contract.getHolders()
    console.log("holders", sbtHolders)
    return sbtHolders
  }

  //get SBT holders
  useFetchEffect(
    async () => {
      //get sbt holders
      // let holders: Holder[] = []
      // try {
      //   const receivedHolders = await getHolders()
      //   console.log("receivedHolders", receivedHolders)
      //   holders = holdersFromChain(receivedHolders)
      // } catch (error) {
      //   console.log(error)
      // }
      const addressArray: string[] = project?.memberIds ?? []

      //はっしー
      const holders: Holder[] = []

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
              amount: holder.amount
            },
          ]
        })
      }
    },
    [project, user],
    {
      skipFetch: [!project, !user],
    }
  )

  return sbtOwners
}
