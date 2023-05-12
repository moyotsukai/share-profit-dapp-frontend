import { useSetEditingProjectState } from "@/states/editingProjectState"
import { useEffect } from "react"

export default function NewProjectAboutVaultPage() {

  const setEditingProjectState = useSetEditingProjectState()

  useEffect(() => {
    return setEditingProjectState(null)
  }, [])

  return (
    <div></div>
  )
}