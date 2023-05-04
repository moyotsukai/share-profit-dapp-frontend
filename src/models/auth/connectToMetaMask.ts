import { ethereum } from './../ethereum/ethereum';
import { auth } from "@/models/firebase/client"
import { toHex } from "@/utils/toHex"
import { User } from "@/types/User.type"
import { getUser } from "../firestore/getUser"
import { createUser } from "../firestore/createUser"
import { updateUser } from "../firestore/updateUser"
import { signInAnonymously } from "firebase/auth"
import { recoverPersonalSignature } from "@metamask/eth-sig-util"
import { requestAccounts } from '../ethereum/requestAccounts';
import { requestSignature } from '../ethereum/requestSignature';

export const connectToMetaMask = async (): Promise<string | null> => {

  if (!ethereum) { return null }

  //request access to ethereum account
  const accounts = await requestAccounts()
  if (!accounts) { return null }

  //sign in anonymously to get permission to access firestore
  await signInAnonymously(auth)

  //get user doc
  const address = ethereum.selectedAddress
  if (!address) { return null }
  const existingUser = await getUser(address)

  //create user doc if not exists
  const user = await createNewUserIfNotExists({ existingUser: existingUser, address: address })

  //create signature
  const signature = await requestSignature({
    nonce: user.nonce,
    address: address
  })
  if (!signature) { return null }

  //verify the signature
  if (!signature) { return null }
  const recoveredAddress = recoverPersonalSignature({
    data: `0x${toHex(user.nonce)}`,
    signature: signature
  })
  if (recoveredAddress !== address) { return null }
  user.nonce = crypto.randomUUID()
  await updateUser(user)

  return address
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