import * as s from './style'

type Props = React.ComponentProps<"input">

const Input: React.FC<Props> = ({ type, placeholder }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      css={s.inputTextStyle}
    />
  )
}

export default Input