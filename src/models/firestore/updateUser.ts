import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { User } from "@/types/User.type"

export const updateUser = async (user: User) => {
  const docRef = doc(db, KEYS.USERS, user.uid)
  await updateDoc(docRef, user)
}