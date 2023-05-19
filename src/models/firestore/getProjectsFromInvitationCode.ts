import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/client'
import { KEYS } from './keys'
import { projectFromFirebase } from './dataConverter'
import { Res } from '../../types/Res'
import { Project } from '@/types/Project.type'

export const getProjectFromInvitationCode = async (invitationCode: string): Promise<Res<Project | null>> => {
  const projectsRef = collection(db, KEYS.PROJECTS)
  const q = query(projectsRef, where(KEYS.PROJECT.INVITATION_CODE, "==", invitationCode))

  try {
    const querySnapshot = await getDocs(q)

    let projects: Project[] = []
    querySnapshot.forEach((doc) => {
      const project = projectFromFirebase(doc.data())
      projects.push(project)
    })

    if (projects) {
      return {
        data: projects[0],
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