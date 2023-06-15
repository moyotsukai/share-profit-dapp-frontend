import SmartAccount from "@biconomy/smart-account"

export type User = {
  uid: string,
  nonce?: string,
  name: string
}

export type UserWithSmartAccount = User & {
  smartAccount?: SmartAccount
}