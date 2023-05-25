import { Project } from "@/types/Project.type"
import { User } from "../../types/User.type"
import { Task } from "@/types/Task"

export const userFromFirebase = (data: any): User => {
  return {
    uid: data.uid ?? "",
    nonce: data.nonce ?? ""
  }
}

export const projectFromFirebase = (data: any): Project => {
  return {
    id: data.id ?? "",
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
    tasks: [],
    taskIndexes: data.taskIndexes ?? []
  }
}

export const taskFromFirebase = (data: any): Task => {
  return {
    id: data.id ?? "",
    title: data.title ?? "",
    stage: data.stage ?? "todo",
    outline: data.outline,
    details: data.details ?? "",
    bountySbt: data.bountySbt ?? 0,
    ownerId: data.ownerId ?? "",
    asigneeIds: data.asigneeIds ?? [],
    assignmentApplicationIds: data.assignmentApplicationIds ?? [],
    submissionIds: data.submissionIds ?? []
  }
}
