import { User, UserWithSmartAccount } from "@/types/User"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"

const userState = atom<UserWithSmartAccount | null | undefined>({
  key: "userState",
  default: undefined
})

export const useUserValue = () => useRecoilValue(userState)

export const useSetUserState = () => useSetRecoilState(userState)

export const useUserState = () => useRecoilState(userState)