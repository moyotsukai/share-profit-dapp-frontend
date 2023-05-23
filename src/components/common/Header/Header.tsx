import { ConnectButton } from "web3uikit"
import * as s from "./style"

const Header: React.FC = () => {
  return (
    <header css={s.headerStyle}>
      <div css={s.spacerStyle} />
      <ConnectButton moralisAuth={false} />
    </header>
  )
}

export default Header