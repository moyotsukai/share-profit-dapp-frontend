import { Project } from "@/types/Project.type";
import Title from "../ui/Title/Title";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getProjectFromId } from "@/models/firestore/getProjectFromId";
import { useFetchEffect } from "@/models/project/useFetchEffect";
import Link from "next/link";
import TabBar from "../radix/TabBar";
import { useUserValue } from "@/states/userState";
import { updateProjectArray } from "@/models/firestore/updateProject";
import LoadingCircle from "../ui/LoadingCircle/LoadingCircle";
import { downloadImageFromUrl } from "@/models/storage/downloadProjectImage";
import { Avatar } from "../radix/Avatar/Avatar";
import { SbtOwner } from "@/types/SbtOwner.type";
import { useWeb3Contract } from "react-moralis";
import securitiesAbi from "../../../constants/Securities.json";

export default function ProjectPage() {
  const sbtAddr = "0xa271BdAd273e282B909419d29074Ec2B56100368";

  const router = useRouter();
  const { projectId } = router.query;
  const user = useUserValue();
  const [project, setProject] = useState<Project | null | undefined>(undefined);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isProjectOwner, setIsProjectOwner] = useState<boolean>(false);
  const [sbtOwners, setSbtOwners] = useState<SbtOwner[]>([]);

  const { runContractFunction: getHolders } = useWeb3Contract({
    abi: securitiesAbi,
    contractAddress: sbtAddr,
    functionName: "getHolders",
    params: {},
  });

  //get project
  useFetchEffect(async () => {
    if (typeof projectId !== "string") {
      return;
    }
    if (!projectId) {
      return;
    }

    const { data: projectData } = await getProjectFromId(projectId);
    if (!projectData) {
      return;
    }
    if (projectData.imageUrl) {
      const { data: downloadImageUrl } = await downloadImageFromUrl(
        projectData.imageUrl
      );
      setProject({
        ...projectData,
        downloadImageUrl: downloadImageUrl,
      });
    } else {
      setProject(projectData);
    }

    //TODO
    //setProject globally
  }, [projectId]);

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
          <TabBar.Root defaultValue="overview">
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
            </TabBar.List>

            <TabBar.Content value="overview">
              <div>
                {isProjectOwner && (
                  <div>
                    <p>Share the following information with project members.</p>
                    <p>Invitation code</p>
                    <p>{project.invitationCode}</p>
                  </div>
                )}
                {project.twitterUrl && (
                  <div>
                    <Link href={project.twitterUrl}>Twitter</Link>
                  </div>
                )}
                {project.discordUrl && (
                  <div>
                    <Link href={project.discordUrl}>Discord</Link>
                  </div>
                )}
                {project.details && (
                  <div>
                    <p>{project.details}</p>
                  </div>
                )}
                <div>
                  <p>Project vault address</p>
                  <p>{project.vaultAddress}</p>
                </div>
              </div>
            </TabBar.Content>

            <TabBar.Content value="tasks">
              <p>List tasks here</p>
            </TabBar.Content>

            <TabBar.Content value="sbt-owners">
              <p>Show SBT owners here</p>
            </TabBar.Content>
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
