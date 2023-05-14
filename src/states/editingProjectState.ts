import { Project } from "@/types/Project.type"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

const editingProjectState = atom<Project | null>({
  key: "editingProjectState",
  default: null
})

export const useEditingProjectValue = () => useRecoilValue(editingProjectState)

export const useSetEditingProjectState = () => useSetRecoilState(editingProjectState)

export const useEditingProjectState = () => useRecoilState(editingProjectState)
