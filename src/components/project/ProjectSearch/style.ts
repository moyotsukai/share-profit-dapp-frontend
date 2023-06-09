import { pageMaxWidth } from "@/styles/constants"
import { css } from "@emotion/react"

export const projectSearchContainerStyle = css`
  max-width: ${pageMaxWidth};
  margin: 0 auto;
`

export const searchBarContainerStyle = css`
  display: flex;
  justify-content: center;
`

export const inputContainerStyle = css`
  flex-grow: 1;
  margin: auto 0;
`