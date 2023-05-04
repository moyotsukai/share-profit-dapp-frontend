import { signInWithMetaMask } from "@/models/auth/auth"
import { User } from "@/types/User.type"
import { useState } from "react"

const Connect: React.FC = () => {

  const [user, setUser] = useState<User | null>(null)

  const onClickConnect = async () => {
    const user = await signInWithMetaMask()
    setUser(user)
  }

  return (
    <div>
      <button onClick={onClickConnect}>
        Connect
      </button>
      {user && (
        <p>Successfully connected🎉</p>
      )}
    </div>
  )

}

export default Connect