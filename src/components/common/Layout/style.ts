import { colors } from "@/styles/colors"
import { css } from "@emotion/react"

export const layoutStyle = css`
  background-color: ${colors.background};
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 100%;
  min-height: 100vh;
`