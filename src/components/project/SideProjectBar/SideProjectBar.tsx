import SideTab from "@/components/project/SideProjectTab/SideProjectTab"
import * as s from "./style"
import Spacer from "@/components/ui/Spacer/Spacer"
import React from "react"
import Divider from "@/components/ui/Divider/Divider"
import { PATHS } from "@/components/pages/paths"

const projects = [
  {
    id: "a",
    name: "Project 1"
  },
  {
    id: "b",
    name: "ProjectAAAAAAAAAAABBBBBBCCCCC"
  }
]

const SideBar: React.FC = () => {
  return (
    <div css={s.sideProjectBarStyle}>
      <Spacer size={6} />
      <SideTab
        href={PATHS.INDEX}
        avatar="home"
      >
        Home
      </SideTab>
      <Spacer size={12} />
      <Divider />
      <Spacer size={12} />

      <p css={s.labelStyle}>Projects</p>

      {projects.map((project, index) => (
        <React.Fragment key={index}>
          <Spacer size={6} />
          <SideTab
            href={`${PATHS.PROJECTS}/${project.id}`}
            avatar={null}
          >
            {project.name}
          </SideTab>
        </React.Fragment>
      ))}

      <Spacer size={6} />
      <SideTab
        href={PATHS.NEW_PROJECT.ABOUT_PROJECT}
        avatar="new">
        Create new
      </SideTab>
    </div>
  )
}

export default SideBar