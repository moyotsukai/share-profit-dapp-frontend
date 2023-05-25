import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { Res } from "../../types/Res"
import { AssignmentApplication, EditingAssignmentApplication } from "@/types/assignmentApplication"

export const createAssignmentApplication = async (assignmentApplication: EditingAssignmentApplication): Promise<Res<AssignmentApplication | null>> => {

  const docId = doc(collection(db, KEYS.ASSIGNMENT_APPLICATIONS)).id
  const docRef = doc(collection(db, KEYS.ASSIGNMENT_APPLICATIONS), docId)

  try {
    await setDoc(docRef, assignmentApplication)
    return {
      data: {
        ...assignmentApplication,
        id: docId
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
