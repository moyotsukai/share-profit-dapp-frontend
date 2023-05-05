import Link from "next/link"
import * as s from "./style"
import { useRouter } from "next/router"
import Spacer from "@/components/ui/Spacer"

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
      <Spacer size={6} isVertical={false} />
      {children}
    </Link>
  )
}

export default SideProjectTab