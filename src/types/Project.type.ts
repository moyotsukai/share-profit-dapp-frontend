export type Project = {
  id?: string,
  title: string,
  imageUrl?: string,
  details?: string,
  twitterUrl?: string,
  discordUrl?: string,
  ownerProfitShare: number,
  invitationCode: string,
  state: "ongoing" | "uncompleted",
  createdBy: string,
  ownerIds: string[],
  memberIds?: string[],
  lastModifiedAt: Date,
  sbtImageUrl?: string,
  sbtTokenName?: string,
  sbtTokenSymbol?: string,
  vaultAddress?: string
}