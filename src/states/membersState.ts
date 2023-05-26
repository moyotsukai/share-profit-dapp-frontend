import { User } from "@/types/User"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

const membersState = atom<User[]>({
  key: "membersState",
  default: []
})

export const useMembersValue = () => useRecoilValue(membersState)

export const useSetMembersState = () => useSetRecoilState(membersState)

export const useMembersState = () => useRecoilState(membersState)