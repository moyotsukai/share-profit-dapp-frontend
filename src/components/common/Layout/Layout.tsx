import * as s from "./style"

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div css={s.layoutStyle}>
      {children}
    </div>
  )
}

export default Layout