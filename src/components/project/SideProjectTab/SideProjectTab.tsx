import Link from "next/link"
import * as s from "./style"
import { useRouter } from "next/router"

type Props = {
  href: string,
  avatar: string | "home" | "new" | null,
  children?: React.ReactNode
}

const SideProjectTab: React.FC<Props> = ({ href, avatar, children }) => {

  const router = useRouter()
  const isActive = router.asPath === href
  const image =
    avatar === "home" ? "🏠"
      : avatar === "new" ? "+"
        : avatar ? ""
          : ""

  return (
    <Link href={href} css={() => s.sideTabStyle(isActive)}>
      <div css={s.avatarStyle}>
        {image}
      </div>
      <span css={s.textStyle}>
        {children}
      </span>
    </Link>
  )
}

export default SideProjectTab