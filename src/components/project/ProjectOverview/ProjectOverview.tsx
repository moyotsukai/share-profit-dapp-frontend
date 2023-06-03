import { Project } from "@/types/Project";
import * as s from "./style";
import React from "react"
import Link from "next/link";

type Props = {
  project: Project
  isProjectOwner: boolean
}

const ProjectOverview: React.FC<Props> = ({ project, isProjectOwner }) => {

  return (
    <div>
      {isProjectOwner && (
        <div>
          <p>
            Share the following information with project members.
          </p>
          <p>
            Invitation code
          </p>
          <p>
            {project.invitationCode}
          </p>
        </div>
      )}
      {project.twitterUrl && (
        <div>
          <Link href={project.twitterUrl}>
            Twitter
          </Link>
        </div>
      )}
      {project.discordUrl && (
        <div>
          <Link href={project.discordUrl}>
            Discord
          </Link>
        </div>
      )}
      {project.details && (
        <div>
          <p>
            {project.details}
          </p>
        </div>
      )}
      <div>
        <p>
          Project treasury address
        </p>
        <p>
          {project.vaultAddress}
        </p>
      </div>
    </div>
  )
}

export default ProjectOverview
