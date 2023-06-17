import * as s from "./style";
import React from "react"
import { SbtOwner } from "@/types/SbtOwner";

type Props = {
  sbtOwners: SbtOwner[]
}

const SbtOwners: React.FC<Props> = ({ sbtOwners }) => {
  console.log(sbtOwners)

  return (
    <ul>
      {sbtOwners.map((owner, index) => (
        <li key={index}>
          <p>
            {owner.name}
          </p>
        </li>
      ))}
    </ul>
  )
}

export default SbtOwners
