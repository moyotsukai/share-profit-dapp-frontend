import { Project } from "@/types/Project.type"
import { User } from "../../types/User.type"

export const userFromFirebase = (data: any): User => {
  return {
    uid: data.uid ?? "",
    nonce: data.nonce ?? ""
  }
}

export const projectFromFirebase = (data: any): Project => {
  return {
    id: data.id,
    title: data.title ?? "",
    imageUrl: data.imageUrl,
    details: data.details,
    twitterUrl: data.twitterUrl,
    discordUrl: data.discordUrl,
    ownerProfitShare: data.ownerProfitShare ?? 0,
    invitationCode: data.invitationCode ?? "",
    state: data.state ?? "uncompleted",
    createdBy: data.createdBy ?? "",
    ownerIds: data.ownerIds ?? [],
    memberIds: data.memberIds ?? [],
    lastModifiedAt: data.lastModifiedAt ?? new Date(),
    sbtImageUrl: data.sbtImageUrl,
    sbtTokenName: data.sbtTokenName,
    sbtTokenSymbol: data.sbtTokenSymbol,
    vaultAddress: data.vaultAddress,
    tasks: data.tasks ?? [],
    taskIndexes: data.taskIndexes ?? []
  }
}
