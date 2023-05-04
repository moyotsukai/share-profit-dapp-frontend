import { auth } from "@/models/firebase/client"
import { BaseProvider } from "@metamask/providers"
import { toHex } from "@/utils/toHex"
import { User } from "@/types/User.type"
import { getUser } from "../firestore/getUser"
import { createUser } from "../firestore/createUser"
import { updateUser } from "../firestore/updateUser"
import { signInAnonymously, signInWithCustomToken } from "firebase/auth"
import { userFromFirebase } from "../firestore/dataConverter"
import { recoverPersonalSignature } from "@metamask/eth-sig-util"

export const signInWithMetaMask = async (): Promise<User | null> => {
  //request access to ethereum account
  if (typeof window === "undefined") { return null }
  const ethereum = (window as any).ethereum as BaseProvider
  if (!ethereum) { return null }
  const accounts = await ethereum.request({
    method: 'eth_requestAccounts'
  }) as string[]

  //sign in anonymously to get permission to access firestore
  await signInAnonymously(auth)

  //get user doc
  const _ = accounts[0]
  const address = ethereum.selectedAddress
  if (!address) { return null }
  const existingUser = await getUser(address)

  //create user doc if not exists
  const user = await createNewUserIfNotExists({ existingUser: existingUser, address: address })

  //create signature
  const signature = await ethereum.request({
    method: "personal_sign",
    params: [
      `0x${toHex(user.nonce)}`,
      address,
    ],
  }) as string

  //verify the signature
  if (!signature) { return null }
  const recoveredAddress = recoverPersonalSignature({
    data: `0x${toHex(user.nonce)}`,
    signature: signature
  })
  if (recoveredAddress !== address) { return null }
  user.nonce = crypto.randomUUID()
  await updateUser(user)

  //generate firebase custom token
  const customTokenRes = await fetch(`/api/custom-token?address=${address}`)
  const customToken = await customTokenRes.json() as string

  //authenticate using the custom token
  const userCredential = await signInWithCustomToken(auth, customToken)
  const authenticatedUser = userFromFirebase(userCredential.user)

  return authenticatedUser
}


const createNewUserIfNotExists = async ({ existingUser, address }: { existingUser: User | null, address: string }): Promise<User> => {
  if (existingUser && existingUser.nonce) {
    return existingUser

  } else {
    const newUser: User = {
      uid: address,
      nonce: crypto.randomUUID()
    }
    await createUser(newUser)
    return newUser
  }
}