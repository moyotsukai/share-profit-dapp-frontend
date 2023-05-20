import { WhereFilterOp, collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase/client'
import { KEYS } from './keys'
import { projectFromFirebase } from './dataConverter'
import { Res } from '../../types/Res'
import { Project } from '@/types/Project.type'

type Props = {
  key: string,
  operation: WhereFilterOp,
  value: string
}

export const getProjectsWhere = async ({ key, operation, value }: Props): Promise<Res<Project[] | null>> => {

  const projectsRef = collection(db, KEYS.PROJECTS)
  const q = query(projectsRef, where(key, operation, value))

  try {
    const querySnapshot = await getDocs(q)

    let projects: Project[] = []
    querySnapshot.forEach((doc) => {
      const project = projectFromFirebase(doc.data())
      projects.push(project)
    })

    return {
      data: projects,
      error: null
    }

  } catch (error) {
    return {
      data: null,
      error: error
    }
  }
}
