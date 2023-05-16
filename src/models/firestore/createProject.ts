import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { Res } from "../../types/Res"
import { EditingProject, EditingProjectWithId } from "@/types/Project.type"

export const createProject = async (project: EditingProject): Promise<Res<EditingProjectWithId | null>> => {
  const docRef = doc(collection(db, KEYS.PROJECTS))

  try {
    await setDoc(docRef, project)
    return {
      data: {
        ...project,
        id: docRef.id
      },
      error: null
    }

  } catch (error) {
    return {
      data: null,
      error: error
    }
  }
}