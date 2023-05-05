import TabBar from "../radix/TabBar";
import Button from "../ui/Button";
import Spacer from "../ui/Spacer/Spacer";

export default function IndexPage() {

  const onClickReceiveDistribution = () => {
    //
  }

  return (
    <div>
      <TabBar.Root defaultValue="projects">
        <TabBar.List>
          <TabBar.Trigger value="projects">
            Projects
          </TabBar.Trigger>
          <TabBar.Trigger value="revenue">
            Revenue
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
          <p>0 ETH</p>
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
