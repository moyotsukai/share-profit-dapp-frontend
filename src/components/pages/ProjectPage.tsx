import Title from "../ui/Title/Title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProjectFromId } from "@/models/firestore/getProjectFromId";
import { useFetchEffect } from "@/models/project/useFetchEffect";
import TabBar from "../radix/TabBar";
import { useUserValue } from "@/states/userState";
import { updateProjectArray } from "@/models/firestore/updateProject";
import LoadingCircle from "../ui/LoadingCircle/LoadingCircle";
import { downloadImageFromUrl } from "@/models/storage/downloadProjectImage";
import { Avatar } from "../radix/Avatar/Avatar";
import { SbtOwner } from "@/types/SbtOwner.type";
import { useWeb3Contract } from "react-moralis";
import securitiesAbi from "../../../constants/Securities.json";
import TaskBoard from "../task/TaskBoard"
import { useProjectState } from "@/states/projectState"
import { getTasksFromId } from "@/models/firestore/getTasksFromId";
import Assignments from "../task/Assignments";
import ProjectOverview from "../project/ProjectOverview/ProjectOverview";
import { AssignmentApplication } from "@/types/assignmentApplication";
import { getAssignmentApplicationFromId } from "@/models/firestore/getAssignmentApplicationFromId";
import { Submission } from "@/types/submission";
import { getSubmissionFromId } from "@/models/firestore/getSubmissionFromId";

export default function ProjectPage() {
  const sbtAddr = "0xa271BdAd273e282B909419d29074Ec2B56100368";
  const router = useRouter();
  const { projectId, taskId } = router.query;
  const user = useUserValue();
  const [project, setProject] = useProjectState()
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false);
  const [sbtOwners, setSbtOwners] = useState<SbtOwner[]>([]);
  const { runContractFunction: getHolders } = useWeb3Contract({
    abi: securitiesAbi,
    contractAddress: sbtAddr,
    functionName: "getHolders",
    params: {},
  });
  const [assignmentApplications, setAssignmentApplications] = useState<AssignmentApplication[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])

  //get project
  useFetchEffect(async () => {
    if (typeof projectId !== "string") { return }
    if (!projectId) { return }

    //get project
    const { data: projectData } = await getProjectFromId(projectId)
    if (!projectData) { return }

    //get tasks
    const { data: tasksData } = await getTasksFromId(projectId)

    //set project state
    if (projectData.imageUrl) {
      const { data: downloadImageUrl } = await downloadImageFromUrl(projectData.imageUrl)
      setProject({
        ...projectData,
        tasks: tasksData ?? [],
        downloadImageUrl: downloadImageUrl
      })
    } else {
      setProject({
        ...projectData,
        tasks: tasksData ?? []
      })
    }

    //get assignment applications
    if (!user || !tasksData || !projectData) { return }
    if (!projectData.ownerIds.includes(user.uid)) { return }
    const allAssignmentApplicationIds: string[] = tasksData.map((task) => task.assignmentApplicationIds).flat()
    for (let i = 0; i < allAssignmentApplicationIds.length; i++) {
      const assignmentApplicationId = allAssignmentApplicationIds[i]
      const { data } = await getAssignmentApplicationFromId(assignmentApplicationId)
      if (!data) { continue }
      setAssignmentApplications((currentValue) => [...currentValue, data])
    }

    //get submissions
    const allSubmissionIds: string[] = tasksData.map((task) => task.submissionIds).flat()
    for (let i = 0; i < allSubmissionIds.length; i++) {
      const submissionId = allSubmissionIds[i]
      const { data } = await getSubmissionFromId(submissionId)
      if (!data) { continue }
      setSubmissions((currentValue) => [...currentValue, data])
    }
  }, [])

  //set if user needs to enter invitation code
  useEffect(() => {
    if (!project || !user) {
      return;
    }
    if (project.ownerIds.includes(user.uid)) {
      setIsProjectOwner(true);
      setIsVerified(true);
    } else {
      setIsVerified(project.memberIds.includes(user.uid));
    }
  }, [project, user]);

  //get SBT owners
  useFetchEffect(async () => {
    //TODO
    //Hashimoto
    //get sbt owners
    const owners: SbtOwner[] = (await getHolders()) as SbtOwner[];

    //set sbt owner state
    setSbtOwners(owners);
  }, []);

  const onChangeInvitationCode = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const text = event.target.value;
    if (!project) {
      return;
    }
    if (!user) {
      return;
    }
    if (text === project.invitationCode) {
      setIsVerified(true);
      await updateProjectArray({
        projectId: project.id,
        key: "memberIds",
        value: user.uid,
        method: "union",
      });
    }
  };

  return (
    <div>
      {project ? (
        isVerified ? (
          <TabBar.Root defaultValue={taskId ? "tasks" : "overview"}>
            <div>
              {project.downloadImageUrl ? (
                <div>
                  <Avatar
                    src={project.downloadImageUrl}
                    alt="project icon"
                    fallback={project.title.substring(0, 1)}
                  />
                </div>
              ) : (
                <div>
                  <Avatar fallback={project.title.substring(0, 1)} />
                </div>
              )}
              <p>{project.title}</p>
            </div>

            <TabBar.List>
              <TabBar.Trigger value="overview">Overview</TabBar.Trigger>
              <TabBar.Trigger value="tasks">Tasks</TabBar.Trigger>
              <TabBar.Trigger value="sbt-owners">SBT owners</TabBar.Trigger>
              {isProjectOwner &&
                <TabBar.Trigger value="assignments">Assignments</TabBar.Trigger>
              }
            </TabBar.List>

            <TabBar.Content value="overview">
              <ProjectOverview
                project={project}
                isProjectOwner={isProjectOwner}
              />
            </TabBar.Content>

            <TabBar.Content value="tasks">
              <TaskBoard />
            </TabBar.Content>

            <TabBar.Content value="sbt-owners">
              <p>Show SBT owners here</p>
            </TabBar.Content>

            {isProjectOwner &&
              <TabBar.Content value="assignments">
                <Assignments
                  assignmentApplications={assignmentApplications}
                  submissions={submissions}
                />
              </TabBar.Content>
            }
          </TabBar.Root>
        ) : (
          <div>
            <p>Enter invitation code</p>
            <input type="text" onChange={onChangeInvitationCode} />
          </div>
        )
      ) : project === undefined ? (
        <div>
          <p>Loading</p>
          <LoadingCircle />
        </div>
      ) : (
        <div>
          <Title>Project not found</Title>
        </div>
      )}
    </div>
  );
}
