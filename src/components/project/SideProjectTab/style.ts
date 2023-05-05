import { colors } from "@/styles/colors"
import { css } from "@emotion/react"

export const sideTabStyle = (isActive: boolean) => css`
  display: block;
  height: 42px;
  overflow: hidden;
  background-color: ${isActive ? colors.primarySelected : "#fff"};
  color: ${isActive ? colors.primary : "#000"};
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 12pt;
  border-radius: 6px;
  text-align: left;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: left;
  &:hover {
    color: ${isActive ? "" : colors.primaryElevated};
  }
  transition: 0.1s ease-in-out;
`

export const avatarStyle = css`
  width: 34px;
  height: 34px;
  border-radius: 17px;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
`