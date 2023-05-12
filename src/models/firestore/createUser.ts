import { User } from "../../types/User.type"
import { doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { Res } from "../../types/Res"

export const createUser = async (user: User): Promise<Res<null>> => {
  const docRef = doc(db, KEYS.USERS, user.uid)

  try {
    await setDoc(docRef, user)
    return {
      data: null,
      error: null
    }

  } catch (error) {
    return {
      data: null,
      error: error
    }
  }
}