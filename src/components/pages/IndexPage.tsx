import { useEffect, useState } from "react";
import TabBar from "../radix/TabBar";
import Button from "../ui/Button";
import Spacer from "../ui/Spacer/Spacer";
import { useUserValue } from "@/states/userState";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getProjectFromInvitationCode } from "@/models/firestore/getProjectsFromInvitationCode";
import { Project } from "@/types/Project.type";
import { updateProjectArray } from "@/models/firestore/updateProject";
import { useRouter } from "next/router";
import { PATHS } from "./paths";

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
  const [projects, setProjects] = useState<Project | null | undefined>()

  const [unreceivedDistributionBalance, setUnreceivedDistributionBalance] = useState<number | null>(null)

  useEffect(() => {
    //TODO
    setUnreceivedDistributionBalance(0)
  }, [])

  const onClickSearch: SubmitHandler<SearchProject> = async (data) => {
    //get projects where invitatoin code matches
    const { data: project } = await getProjectFromInvitationCode(data.enteredText)
    if (!project) { return }
    setProjects(project)

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

  const onClickReceiveDistribution = () => {
    //TODO
    //Hashimoto
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
