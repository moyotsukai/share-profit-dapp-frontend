import { auth } from "@/models/firebase/client"
import { User } from "../../types/User.type"
import { signInWithCustomToken } from "firebase/auth"
import { userFromFirebase } from "../firestore/dataConverter"

type Props = {
  address: string
}

export const signIn = async ({ address }: Props): Promise<User | null> => {

  //generate firebase custom token
  const customTokenRes = await fetch(`/api/custom-token?address=${address}`)
  const customToken = await customTokenRes.json() as string

  //authenticate using the custom token
  const userCredential = await signInWithCustomToken(auth, customToken)
  const authenticatedUser = userFromFirebase(userCredential.user)

  return authenticatedUser
}
