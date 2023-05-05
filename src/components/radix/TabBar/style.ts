import { colors } from '@/styles/colors'
import { css } from '@emotion/react'

export const rootStyle = css`
  width: 100%;
  height: 60px;
  text-align: center;
`

export const listStyle = css`
  border-bottom: solid 1px #e6e6e6;
`

export const triggerStyle = css`
  font-size: 18px;
  border: none;
  margin: 0 16px;
  background-color: #fff;
  &:hover {
    cursor: pointer;
    color: ${colors.primaryElevated};
  }
  &[data-state='active'] {
    color: ${colors.primary};
  }
  &[data-state='active'] > div {
    border-bottom: solid 1px ${colors.primary};
  }
  transition: 0.1s ease-in-out;
`

export const triggerLabelStyle = css`
  padding: 16px;
`

export const contentStyle = css`
  text-align: left;
`