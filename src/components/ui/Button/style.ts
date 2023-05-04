import { colors } from "@/styles/colors"
import { css } from "@emotion/react"

export const buttonStyle = (isEnabled: boolean) => css`
  min-width: 95px;
  min-height: 42px;
  background-color: ${colors.primary};
  color: #fff;
  font-family: 'Noto Sans JP', sans-serif;
  font-size: 12pt;
  border-radius: 6px;
  background-color: ${isEnabled ? colors.primary : colors.primaryDisabled};
  border: none;
  cursor: ${isEnabled ? "pointer" : "default"};
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
  &:hover {
    cursor: ${isEnabled ? "pointer" : "default"};
    background-color: ${isEnabled ? colors.primaryHovered : colors.primaryDisabled};
    box-shadow: ${isEnabled ? `0 6px 9px 0 ${colors.primaryShadow}` : "none"}
  }
  transition: 0.15s ease-in-out;
`