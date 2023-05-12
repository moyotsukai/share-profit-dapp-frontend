import { doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { Res } from "../../types/Res"
import { Project } from "@/types/Project.type"

export const updateProject = async (project: Partial<Project>): Promise<Res<null>> => {
  if (!project.id) {
    return {
      data: null,
      error: new Error("No project found")
    }
  }

  const docRef = doc(db, KEYS.PROJECTS, project.id)
  try {
    await updateDoc(docRef, project)
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