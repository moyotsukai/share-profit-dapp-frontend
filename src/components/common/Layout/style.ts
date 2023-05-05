import { colors } from "@/styles/colors"
import { css } from "@emotion/react"

export const layoutStyle = css`
  padding: 12px;
  background-color: ${colors.background};
  display: grid;
  grid-template-rows: 1fr auto;
  grid-template-columns: 100%;
  min-height: 100vh;
`

export const contentContainerStyle = css`
  margin-left: 200px;
  display: flex;
  flex-direction: row;
  height: 800px;
`

export const contentStyle = css`
  flex-grow: 1;
`