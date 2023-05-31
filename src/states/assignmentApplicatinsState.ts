import { AssignmentApplication } from "@/types/assignmentApplication"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

const assignmentAppicationsState = atom<AssignmentApplication[]>({
  key: "assignmentApplicationsState",
  default: []
})

export const useAssignmentApplicationsState = () => useRecoilValue(assignmentAppicationsState)

export const useSetAssignmentApplicationsState = () => useSetRecoilState(assignmentAppicationsState)

export const useAssignmentApplilcationsState = () => useRecoilState(assignmentAppicationsState)
