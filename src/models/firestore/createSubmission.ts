import { collection, doc, setDoc } from "firebase/firestore"
import { db } from "../firebase/client"
import { KEYS } from "./keys"
import { Res } from "../../types/Res"
import { EditingSubmission, Submission } from "@/types/submission"

export const createSubmission = async (submission: EditingSubmission): Promise<Res<Submission | null>> => {

  const docId = doc(collection(db, KEYS.SUBMISSIONS)).id
  const docRef = doc(collection(db, KEYS.SUBMISSIONS), docId)

  try {
    await setDoc(docRef, submission)
    return {
      data: {
        ...submission,
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