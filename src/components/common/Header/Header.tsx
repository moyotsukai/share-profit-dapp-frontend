import { signIn } from "@/models/auth/signIn"
import * as s from "./style"
import { useSetUserState } from "@/states/userState"
import { useEffect, Suspense } from "react"
import { asyncTask } from "@/utils/asyncTask"
import { getUser } from "@/models/firestore/getUser"
import { createUser } from "@/models/firestore/createUser"
import dynamic from "next/dynamic"
import { User } from "@/types/User"

type Props = {
  user: User | null | undefined
  setUser: (user: User | null) => void
}

const Header: React.FC<Props> = ({ user, setUser }) => {
  const SocialLoginDynamic = dynamic(() => import("../../auth/Scw").then((res) => res.default), {
    ssr: false,
  })

  const props = {
    user,
    setUser,
  }

  return (
    <header css={s.headerStyle}>
      <div css={s.spacerStyle} />
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      <SocialLoginDynamic {...props} />
      {/* </Suspense> */}
    </header>
  )
}

export default Header
