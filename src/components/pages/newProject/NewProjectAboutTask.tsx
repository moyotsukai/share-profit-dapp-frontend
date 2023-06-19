import * as s from "./style"
import Button from "@/components/ui/Button"
import router from "next/router"
import { PATHS } from "../paths"
import { Configuration, OpenAIApi } from "openai"
import { useEditingProjectValue } from "@/states/editingProjectState"
import { useState } from "react"
import Spacer from "@/components/ui/Spacer/Spacer"
import PageContainer from "@/components/ui/PageContainer/PageContainer"

type NewProjectAboutTaskProps = {}

const NewProjectAboutTask: React.FC<NewProjectAboutTaskProps> = () => {
  const [response, setResponse] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const editingProject = useEditingProjectValue()

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })
  delete configuration.baseOptions.headers["User-Agent"]
  const openai = new OpenAIApi(configuration)

  const onQuery = async () => {
    setIsLoading(true)
    if (!editingProject || !editingProject.id) {
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
          content: `Goal is ${editingProject.details}`,
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

  const onMove = async () => {
    //go to next page
    router.push(PATHS.NEW_PROJECT.ABOUT_SBT)
  }

  return (
    <PageContainer>
      <div css={s.gptButton}>
        <Button onClick={onQuery} isLoading={isLoading} style="outlined">
          Query Tasks for chatGPT
        </Button>
      </div>
      {response && (
        <>
          <h2>Tasks that you may need to accomplish your project</h2>
          <Spacer size={20} />
          <div>
            {response.map((item: any, index: string) => (
              <div key={index}>
                <h3>{`Task ${index+1}: ${item.title}`}</h3>
                <div>Outline: {item.outline}</div>
                <div>Amount of SBT: {item.bountySbt}</div>
                <hr />
                <Spacer size={10} />
              </div>
            ))}
          </div>
        </>
      )}
      <Button onClick={onMove}>Go Next</Button>
    </PageContainer>
  )
}
export default NewProjectAboutTask
