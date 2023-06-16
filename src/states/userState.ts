import { User } from "@/types/User"
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { recoilPersist } from "recoil-persist"

const { persistAtom } = recoilPersist()

const userState = atom<User | null | undefined>({
  key: "userState",
  default: undefined,
  dangerouslyAllowMutability: true,
  // effects_UNSTABLE: [persistAtom],
})

export const useUserValue = () => useRecoilValue(userState)

export const useSetUserState = () => useSetRecoilState(userState)

export const useUserState = () => useRecoilState(userState)
