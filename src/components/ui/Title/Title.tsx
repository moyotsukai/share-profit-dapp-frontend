import * as s from './style'

type Props = {
  style?: "title" | "subtitle",
  children: React.ReactNode
}

const Title: React.FC<Props> = ({ style = "title", children }) => {
  return (
    <h1 css={() => s.titleStyle(style)}>
      {children}
    </h1>
  )
}

export default Title