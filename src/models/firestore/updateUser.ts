import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { User } from "../../types/User.type"
import { Res } from "../../types/Res"

export const updateUser = async (user: User): Promise<Res<null>> => {
  const docRef = doc(db, KEYS.USERS, user.uid)
  try {
    await updateDoc(docRef, user)
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