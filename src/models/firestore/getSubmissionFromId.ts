import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/client'
import { KEYS } from './keys'
import { submissionFromFirebase } from './dataConverter'
import { Res } from '../../types/Res'
import { Submission } from '@/types/submission'

export const getSubmissionFromId = async (submissionId: string): Promise<Res<Submission | null>> => {

  const docRef = doc(db, KEYS.SUBMISSIONS, submissionId)

  try {
    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      const submission = submissionFromFirebase({
        ...docSnapshot.data(),
        id: docSnapshot.id
      })
      return {
        data: submission,
        error: null
      }

    } else {
      return {
        data: null,
        error: null
      }
    }
  } catch (error) {
    return {
      data: null,
      error: error
    }
  }
}
