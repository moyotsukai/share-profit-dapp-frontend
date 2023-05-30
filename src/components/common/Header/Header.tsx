import { ConnectButton } from "web3uikit"
import * as s from "./style"
import { useMoralis } from "react-moralis"
import { signIn } from "@/models/auth/signIn"
import { useUserState } from "@/states/userState"

const Header: React.FC = () => {
  const [user, setUser] = useUserState()
  const { account } = useMoralis()

  const onClickConnect = async () => {
    // Hashimoto>>>
    const address = account
    if (address) {
      const user = await signIn({ address: address })
      setUser(user)
    } else {
      setUser(null)
    }
    // <<<Hashimoto
  }

  return (
    <header css={s.headerStyle}>
      <div css={s.spacerStyle} />
      <ConnectButton moralisAuth={false} onClick={onClickConnect} />
    </header>
  )
}

export default Header
