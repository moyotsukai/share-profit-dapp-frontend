import { colors } from "@/styles/colors";
import { css } from "@emotion/react";

export const colmnStyle = css`
  min-height: 225px;
  height: 100%;
  margin: 10px 10px;
  width: 300px;
  padding: 10px;
  background-color: ${colors.card};
  display: flex;
  flex-direction: column;
`

export const titleStyle = css`
  font-size: 16px;
`

export const draggableAreaStyle = css`
  flex-grow: 1;
  width: 100%;
`

export const addNewButtonStyle = css`
  border: solid 1px ${colors.divider};
  border-radius: 6px;
  background-color: transparent;
  width: 100%;
  height: 40px;
  margin: 5px 0;
  text-align: left;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: ${colors.primarySelected};
  }
`