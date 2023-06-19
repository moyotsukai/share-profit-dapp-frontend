import { Project } from "@/types/Project"
import * as s from "./style"
import React, { useState } from "react"
import Link from "next/link"
import Spacer from "@/components/ui/Spacer"
import { Configuration, OpenAIApi } from "openai"
import Button from "@/components/ui/Button/Button"

type Props = {
  project: Project
  isProjectOwner: boolean
}

const ProjectOverview: React.FC<Props> = ({ project, isProjectOwner }) => {
  const [response, setResponse] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })
  delete configuration.baseOptions.headers["User-Agent"]
  const openai = new OpenAIApi(configuration)

  const onQuery = async () => {
    setIsLoading(true)
    if (!project || !project.id) {
      return
    }

    // GPTとのやりとり
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an excellent task manager.",
        },
        {
          role: "system",
          content:
            "Please break down the tasks required to accomplish a given {Goal} into as much detail as possible.",
        },
        {
          role: "system",
          content: "Do not make {Goal} one of your tasks.",
        },
        {
          role: "system",
          content:
            "Please put the output of all decomposed tasks in json format with the following items.",
        },
        {
          role: "system",
          content: "{title : string\noutline : string\ndetails : string\nbountySbt : num}",
        },
        {
          role: "system",
          content:
            'title is the title of the task\noutline is the outline of the task\ndetails is the details of the task. Please describe the task in as much detail as possible, e.g., by providing an "example".\nbountySbt always outputs "1',
        },
        {
          role: "system",
          content: `Goal is ${project.details}`,
        },
        {
          role: "system",
          content: "lang:jp\noutput must be json only",
        },
        {
          role: "system",
          content:
            'For example\n{\n"title": "AA",\n"outline": "BB",\n"details": "CC",\n"bountySbt": 1\n},\n{\n"title": "DD",\n"outline": "EE",\n"details": "FF",\n"bountySbt": 1\n}',
        },
      ],
    })
    const resultString = completion.data.choices[0].message?.content
    const result = JSON.parse(`[${resultString}]`)
    console.log(result)
    setResponse(result)
    setIsLoading(false)
  }

  return (
    <div css={s.projectOverviewStyle}>
      {isProjectOwner && (
        <>
          <Spacer size={30} />
          <div css={s.informationToShareStyle}>
            <p>Share the following information with project members.</p>
            <Spacer size={10} />
            <p>Invitation code</p>
            <p>{project.invitationCode}</p>
          </div>
        </>
      )}

      {project.twitterUrl && (
        <div>
          <Spacer size={30} />
          <p>Twitter</p>
          <Link href={project.twitterUrl} css={s.linkStyle}>
            {project.twitterUrl}
          </Link>
        </div>
      )}

      {project.discordUrl && (
        <div>
          <Spacer size={30} />
          <p>Discord</p>
          <Link href={project.discordUrl} css={s.linkStyle}>
            {project.discordUrl}
          </Link>
        </div>
      )}

      {project.details && (
        <div>
          <Spacer size={30} />
          <p>Details</p>
          <p css={s.textWithBreakStyle}>{project.details}</p>
        </div>
      )}

      <div>
        <Spacer size={30} />
        <p>Project Treasury Address</p>
        <p>{project.vaultAddress}</p>
      </div>

      <div>
        <Spacer size={30} />
        <h2>Tasks that AI suggests your team to do</h2>
        {!isLoading && !response && <Button onClick={onQuery} style="outlined">Ask AI</Button>}
        {isLoading && <p>AI is thinking...</p>}
        {response && (
          <>
            <div>
              {response.map((item: any, index: string) => (
                <div key={index}>
                  <h3>{`Task ${index + 1}: ${item.title}`}</h3>
                  <div>Outline: {item.outline}</div>
                  <div>Amount of SBT: {item.bountySbt}</div>
                  <hr />
                  <Spacer size={10} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default ProjectOverview
