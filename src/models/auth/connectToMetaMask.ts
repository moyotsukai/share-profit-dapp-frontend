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
  const { data: existingUser, error: existingUserError } = await getUser(address)
  if (existingUserError) { return null }

  //create user doc if not exists
  const user = await createNewUserIfNotExists({ existingUser: existingUser, address: address })
  if (!user) { return null }

  //create signature
  const signature = await requestSignature({
    nonce: user.nonce,
    address: address
  })
  if (!signature) { return null }

  //verify the signature
  const recoveredAddress = recoverPersonalSignature({
    data: `0x${toHex(user.nonce)}`,
    signature: signature
  })
  if (recoveredAddress !== address) { return null }
  user.nonce = crypto.randomUUID()
  const { data: _, error: updateUserError } = await updateUser(user)
  if (updateUserError) { return null }

  return address
}


const createNewUserIfNotExists = async ({ existingUser, address }: { existingUser: User | null, address: string }): Promise<User | null> => {

  if (existingUser && existingUser.nonce) {
    return existingUser

  } else {
    const newUser: User = {
      uid: address,
      nonce: crypto.randomUUID()
    }
    const { data: _, error: createUserError } = await createUser(newUser)
    if (createUserError) { return null }

    return newUser
  }
}