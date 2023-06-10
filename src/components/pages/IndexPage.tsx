import ProjectSearch from "../project/ProjectSearch"
import { contractAddressesInterface } from "@/types/networkAddress"
import { Mumbai } from "@thirdweb-dev/chains"
import { useGetProject } from "@/models/project/useGetProject"

export default function IndexPage() {

  return (
    <div>
      <ProjectSearch />
    </div>
  )
}
