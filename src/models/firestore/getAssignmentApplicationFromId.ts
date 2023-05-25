import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/client'
import { KEYS } from './keys'
import { assignmentApplicationFromFirebase } from './dataConverter'
import { Res } from '../../types/Res'
import { AssignmentApplication } from '@/types/assignmentApplication'

export const getAssignmentApplicationFromId = async (assignmentApplicationId: string): Promise<Res<AssignmentApplication | null>> => {

  const docRef = doc(db, KEYS.ASSIGNMENT_APPLICATIONS, assignmentApplicationId)

  try {
    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      const assignmentApplication = assignmentApplicationFromFirebase({
        ...docSnapshot.data(),
        id: docSnapshot.id
      })
      return {
        data: assignmentApplication,
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
