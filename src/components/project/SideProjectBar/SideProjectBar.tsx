import SideTab from "@/components/project/SideProjectTab/SideProjectTab";
import * as s from "./style";
import Spacer from "@/components/ui/Spacer/Spacer";
import React from "react";
import Divider from "@/components/ui/Divider/Divider";
import { useFetchEffect } from "@/models/project/useFetchEffect";
import { getProjectsWhere } from "@/models/firestore/getProjectsWhere";
import { KEYS } from "@/models/firestore/keys";
import { useUserValue } from "@/states/userState";
import { useAttendingProjectState } from "@/states/attendingProjects";
import { ConnectButton } from "web3uikit";

const SideBar: React.FC = () => {
  const user = useUserValue();
  const [projects, setProjects] = useAttendingProjectState();

  //get attending projects
  useFetchEffect(async () => {
    if (!user) {
      return;
    }

    const { data } = await getProjectsWhere({
      key: KEYS.PROJECT.MEMBER_IDS,
      operation: "array-contains",
      value: user.uid,
    });

    if (!data) {
      return;
    }
    setProjects(data);
  }, []);

  return (
    <div css={s.sideProjectBarStyle}>
      <Spacer size={6} />
      <SideTab type="home" project={null} />
      <Spacer size={12} />
      <Divider />
      <Spacer size={12} />

      <p css={s.labelStyle}>Projects</p>

      {projects.map((project, index) => (
        <React.Fragment key={index}>
          <Spacer size={6} />
          <SideTab type="project" project={project} />
        </React.Fragment>
      ))}

      <Spacer size={6} />
      <SideTab type="new" project={null} />
    </div>
  );
};

export default SideBar;
