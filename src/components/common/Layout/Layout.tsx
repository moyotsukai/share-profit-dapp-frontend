import Footer from "../Footer"
import SideBar from "../../project/SideProjectBar"
import * as s from "./style"

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {

  return (
    <div css={s.contentContainerStyle}>
      <SideBar />
      <div css={s.contentStyle}>
        <div css={s.layoutStyle}>
          {children}
          <Footer />
        </div>
      </div>
    </div>


  )
}

export default Layout