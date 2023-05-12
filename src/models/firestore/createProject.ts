import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { Res } from "../../types/Res"
import { Project } from "@/types/Project.type"

export const createProject = async (project: Project): Promise<Res<string | null>> => {
  const docRef = doc(collection(db, KEYS.PROJECTS))

  try {
    await setDoc(docRef, project)
    return {
      data: docRef.id,
      error: null
    }

  } catch (error) {
    return {
      data: null,
      error: error
    }
  }
}