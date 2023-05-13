import * as s from './style'

type Props = {
  children: React.ReactNode
}

const Title: React.FC<Props> = ({ children }) => {
  return (
    <h1 css={s.titleStyle}>
      {children}
    </h1>
  )
}

export default Title