import { signIn } from "@/models/auth/signIn"
import * as s from "./style"
import { ConnectWallet, useAddress } from "@thirdweb-dev/react"
import { useSetUserState } from "@/states/userState"
import { useEffect } from "react"
import { asyncTask } from "@/utils/asyncTask"
import { useSetUserState } from "@/states/userState"
        
const Header: React.FC = () => {
  const setUser = useSetUserState()
  const account = useAddress()

  useEffect(() => {
    const address = account
    asyncTask(async () => {
      if (address) {
        const user = await signIn({ address: address })
        setUser(user)
      } else {
        setUser(null)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <header css={s.headerStyle}>
      <div css={s.spacerStyle} />
      <ConnectWallet />
    </header>
  )
}

export default Header
