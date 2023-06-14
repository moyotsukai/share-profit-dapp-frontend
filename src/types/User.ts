import SmartAccount from "@biconomy/smart-account"

export type User = {
  uid: string,
  smartAccount: SmartAccount
  nonce?: string,
  name: string
}