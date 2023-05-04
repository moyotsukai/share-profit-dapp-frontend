import { User } from "@/types/User.type"

export const userFromFirebase = (data: any): User => {
  return {
    uid: data.uid ?? "",
    nonce: data.nonce ?? ""
  }
}