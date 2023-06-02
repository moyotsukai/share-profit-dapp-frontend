import { Res } from "@/types/Res"
import { ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase/client"
import { PATHS } from "./paths"

type Props = {
  submissionId: string,
  file: File
}

export const uploadSubmissionFile = async ({ submissionId, file }: Props): Promise<Res<string | null>> => {

  const filePath = PATHS.submissionFile({ submissionId: submissionId, fileName: file.name })
  const storageRef = ref(storage, filePath)

  try {
    await uploadBytes(storageRef, file)
    return {
      data: PATHS.ROOT + filePath,
      error: null
    }

  } catch (error) {
    return {
      data: null,
      error: error
    }
  }
}