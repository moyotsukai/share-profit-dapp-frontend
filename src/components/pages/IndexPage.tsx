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
import {
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import accountAbi from "../../../constants/Account.json";
import { ethers } from "ethers";
import { useNotification } from "web3uikit";

const formInputSchema = z.object({
  enteredText: z.string().nonempty(),
});

type SearchProject = z.infer<typeof formInputSchema>;

export default function IndexPage() {
  const user = useUserValue();
  const userAddr = user ? user.uid : "";
  const accountAddr = "0x068419813Bd03FaeeAD20370B0FB106f3A9217E4";
  const tokenAddr = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";
  const router = useRouter();
  const { register, handleSubmit } = useForm<SearchProject>({
    resolver: zodResolver(formInputSchema),
  });

  const dispatch = useNotification();

  const [unreceivedDistributionBalance, setUnreceivedDistributionBalance] =
    useState<string | null>(null);

  const { data: releasableToken, isError } = useContractRead({
    address: accountAddr,
    abi: accountAbi,
    functionName: "releasableToken",
    args: [tokenAddr, userAddr],
  });
  console.log(typeof (releasableToken as bigint));
  console.log(
    ethers.utils
      .parseUnits((releasableToken as bigint).toString(), 6)
      .toString()
  );

  const { config } = usePrepareContractWrite({
    address: accountAddr,
    abi: accountAbi,
    functionName: "withdrawToken",
    args: [tokenAddr],
    overrides: {
      from: userAddr,
    },
  });
  const { data, isLoading, isSuccess, write } = useContractWrite({
    ...config,
    onSuccess() {
      handleWithdrawSuccess();
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  //get unreceived distribution balance
  useFetchEffect(async () => {
    //TODO
    //<<<Hashimoto
    //表示
    setUnreceivedDistributionBalance(
      ethers.utils
        .parseUnits((releasableToken as bigint).toString(), 6)
        .toString()
    );
    //Hashimoto>>>
  }, []);

  const onClickSearch: SubmitHandler<SearchProject> = async (data) => {
    //get projects where invitatoin code matches
    const { data: projects } = await getProjectsWhere({
      key: KEYS.PROJECT.INVITATION_CODE,
      operation: "==",
      value: data.enteredText,
    });
    if (!projects || !projects.length) {
      return;
    }
    const project = projects[0];

    //add user.uid to member ids
    if (!user) {
      return;
    }
    await updateProjectArray({
      projectId: project.id,
      key: "memberIds",
      value: user.uid,
      method: "union",
    });

    //go to project page
    router.push(PATHS.PROJECT(project.id));
  };

  const onEnterDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    handleSubmit(onClickSearch);
  };

  const onClickReceiveDistribution = () => {
    //TODO
    //<<<Hashimoto
    //分配金の残高を受け取る
    if (write) {
      write();
    }

    //表示を更新
    setUnreceivedDistributionBalance("0");
    //Hashimoto>>>
  };

  async function handleWithdrawSuccess() {
    dispatch({
      type: "success",
      message: "Withdrawing proceeds!",
      title: "Withdrawing!",
      position: "topR",
    });
  }

  return (
    <div>
      <TabBar.Root defaultValue="projects">
        <TabBar.List>
          <TabBar.Trigger value="projects">Projects</TabBar.Trigger>
          <TabBar.Trigger value="revenue">Balance</TabBar.Trigger>
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
            <button onClick={handleSubmit(onClickSearch)}>Search</button>
          </form>
        </TabBar.Content>

        <TabBar.Content value="revenue">
          <p>Unreceived distribution balance</p>
          {unreceivedDistributionBalance !== null && (
            <p>{`${unreceivedDistributionBalance} USDC`}</p>
          )}
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
  );
}
