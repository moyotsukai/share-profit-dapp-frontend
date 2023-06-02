import { ConnectButton } from "web3uikit"
import * as s from "./style"
import { useMoralis } from "react-moralis"
import { signIn } from "@/models/auth/signIn"
import { useSetUserState } from "@/states/userState"

const Header: React.FC = () => {
  const setUser = useSetUserState()
  const { account } = useMoralis()

  const onClickConnect = async () => {
    const address = account
    if (address) {
      const user = await signIn({ address: address })
      setUser(user)
    } else {
      setUser(null)
    }
  }

  return (
    <header css={s.headerStyle}>
      <div css={s.spacerStyle} />
      <ConnectButton moralisAuth={false} onClick={onClickConnect} />
    </header>
  )
}

export default Header
