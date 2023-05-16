import { getProjectFromId } from "@/models/firestore/getProjectFromId"
import { atomFamily, selectorFamily, useRecoilValue } from "recoil"

// const projectState = atomFamily({
//   key: "projectState",
//   default: selectorFamily({
//     key: "getProject",
//     get: (projectId: string) => async () => {
//       if (!projectId) { return null }
//       const { data } = await getProjectFromId(projectId)
//       return data
//     }
//   })
// })

// export const useProjectValue = (projectId: string) => useRecoilValue(projectState(projectId))
