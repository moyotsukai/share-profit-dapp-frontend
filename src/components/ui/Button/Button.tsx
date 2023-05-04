import LoadingCircle from "../LoadingCircle/LoadingCircle"
import * as s from "./style"

type Props = {
  onClick: React.MouseEventHandler<HTMLButtonElement>
  isEnabled: boolean
  isLoading: boolean
  children?: React.ReactNode
}

const Button: React.FC<Props> = ({ onClick, isEnabled, isLoading, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={!isEnabled}
      css={() => s.buttonStyle(isEnabled)}
    >
      {children}
      {isLoading &&
        <LoadingCircle />
      }
    </button>
  )
}

export default Button