import { useEffect } from "react"
import { signInWithMoralis } from '@moralisweb3/client-firebase-evm-auth'
import { moralisAuth } from "@/models/auth/moralisAuth"

export default function SamplePage() {

  const onClickSignIn = async () => {
    const user = await signInWithMoralis(moralisAuth)
    console.log("user: ", user)
  }

  return (
    <button onClick={onClickSignIn}>
      Connect with MetaMask
    </button>
  )
}
