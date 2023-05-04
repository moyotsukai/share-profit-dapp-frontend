import { User } from "@/types/User.type"
import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"

export const createUser = async (user: User) => {
  const docRef = doc(db, KEYS.USERS, user.uid)
  await setDoc(docRef, user)
}