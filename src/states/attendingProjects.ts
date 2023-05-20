import { Project } from "@/types/Project.type"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

const attendingProjectsState = atom<Project[]>({
  key: "attendingProjectsState",
  default: []
})

export const useAttendingProjectsValue = () => useRecoilValue(attendingProjectsState)

export const useSetAttendingProjectState = () => useSetRecoilState(attendingProjectsState)

export const useAttendingProjectState = () => useRecoilState(attendingProjectsState)
