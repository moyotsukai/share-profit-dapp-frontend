import { useState } from "react";
import TabBar from "../radix/TabBar";
import Button from "../ui/Button";
import Spacer from "../ui/Spacer/Spacer";
import { useUserValue } from "@/states/userState";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProjectArray } from "@/models/firestore/updateProject";
import { useRouter } from "next/router";
import { PATHS } from "./paths";
import { useFetchEffect } from "@/models/project/useFetchEffect";
import { getProjectsWhere } from "@/models/firestore/getProjectsWhere";
import { KEYS } from "@/models/firestore/keys";

const formInputSchema = z
  .object({
    enteredText: z
      .string()
      .nonempty()
  })

type SearchProject = z.infer<typeof formInputSchema>

export default function IndexPage() {

  const user = useUserValue()
  const router = useRouter()
  const { register, handleSubmit } = useForm<SearchProject>({ resolver: zodResolver(formInputSchema) })

  const [unreceivedDistributionBalance, setUnreceivedDistributionBalance] = useState<number | null>(null)

  //get unreceived distribution balance
  useFetchEffect(async () => {
    //TODO
    //<<<Hashimoto
    //分配金残高を取得

    //表示
    setUnreceivedDistributionBalance(0)
    //Hashimoto>>>
  }, [])

  const onClickSearch: SubmitHandler<SearchProject> = async (data) => {
    //get projects where invitatoin code matches
    const { data: projects } = await getProjectsWhere({
      key: KEYS.PROJECT.INVITATION_CODE,
      operation: "==",
      value: data.enteredText
    })
    if (!projects || !projects.length) { return }
    const project = projects[0]

    //add user.uid to member ids
    if (!user) { return }
    await updateProjectArray({
      projectId: project.id,
      key: "memberIds",
      value: user.uid,
      method: "union"
    })

    //go to project page
    router.push(PATHS.PROJECT(project.id))
  }

  const onEnterDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") { return }
    handleSubmit(onClickSearch)
  }

  const onClickReceiveDistribution = () => {
    //TODO
    //<<<Hashimoto
    //分配金の残高を受け取る

    //表示を更新
    setUnreceivedDistributionBalance(0)
    //Hashimoto>>>
  }

  return (
    <div>
      <TabBar.Root defaultValue="projects">
        <TabBar.List>
          <TabBar.Trigger value="projects">
            Projects
          </TabBar.Trigger>
          <TabBar.Trigger value="revenue">
            Balance
          </TabBar.Trigger>
        </TabBar.List>

        <TabBar.Content value="projects">
          <form>
            <label>
              <p>Search projects</p>
              <input
                type="text"
                placeholder="Search projects..."
                onKeyDown={onEnterDown}
                {...register("enteredText")}
              />
            </label>
            <button onClick={handleSubmit(onClickSearch)}>
              Search
            </button>
          </form>
        </TabBar.Content>

        <TabBar.Content value="revenue">
          <p>Unreceived distribution balance</p>
          {unreceivedDistributionBalance !== null &&
            <p>{`${unreceivedDistributionBalance} USDC`}</p>
          }
          <Spacer size={60} />
          <p>Receive distribution</p>
          <Button
            onClick={onClickReceiveDistribution}
            isEnabled={true}
            isLoading={false}
          >
            Receive distribution
          </Button>
        </TabBar.Content>
      </TabBar.Root>
    </div>
  )
}
