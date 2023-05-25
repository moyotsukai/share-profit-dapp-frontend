import { asyncTask } from "@/utils/asyncTask"
import { DependencyList, useEffect, useRef } from "react"

export const useFetchEffect = (action: () => void, deps: DependencyList) => {

  const hasFetched = useRef<boolean>(false)

  useEffect(() => {
    if (hasFetched.current) { return }

    asyncTask(async () => {
      action()
      hasFetched.current = true
    })
  }, [deps])
}