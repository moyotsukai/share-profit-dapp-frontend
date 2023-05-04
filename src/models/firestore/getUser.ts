import { doc, getDoc } from 'firebase/firestore'
import { User } from './../../types/User.type'
import { db } from '../firebase/client'
import { KEYS } from './keys'
import { userFromFirebase } from './dataConverter'

export const getUser = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, KEYS.USERS, uid)
  const docSnapshot = await getDoc(docRef)

  if (docSnapshot.exists()) {
    const user = userFromFirebase(docSnapshot.data())
    return user

  } else {
    return null
  }
}