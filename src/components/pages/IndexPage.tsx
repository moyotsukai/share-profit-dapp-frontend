import { useEffect, useState } from "react";
import TabBar from "../radix/TabBar";
import Button from "../ui/Button";
import Spacer from "../ui/Spacer/Spacer";

export default function IndexPage() {

  const [unreceivedDistributionBalance, setUnreceivedDistributionBalance] = useState<number | null>(null)

  useEffect(() => {
    //TODO
    setUnreceivedDistributionBalance(0)
  }, [])

  const onClickReceiveDistribution = () => {
    //TODO
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
          <p>Search projects</p>
          <input
            type="text"
            placeholder="Search projects..."
          />
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
