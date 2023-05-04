import { connectToMetaMask } from "@/models/auth/connectToMetaMask"
import { signIn } from "@/models/auth/signIn"
import { ethereum } from "@/models/ethereum/ethereum"
import { User } from "@/types/User.type"
import { asyncTask } from "@/utils/asyncTask"
import { useEffect, useState } from "react"
import Button from "../ui/Button"

type Props = {
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {

  //todo: use Recoil
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [message, setMessage] = useState<string>("")
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

  useEffect(() => {
    if (user) {
      //user is already signed in
      //do nothing
    } else {
      if (ethereum) {
        const address = ethereum.selectedAddress
        if (address) {
          //connected, sign in
          asyncTask(async () => {
            const authenticatedUser = await signIn({ address: address })
            setUser(authenticatedUser)
          })
        } else {
          //not connected, user needs to connect and sign in manually
          setUser(null)
        }
      } else {
        //user needs to install MetaMask
        setMessage("Please install MetaMask")
        setUser(null)
      }
    }
  }, [])

  const onClickConnect = async () => {
    setIsButtonEnabled(false)
    setIsButtonLoading(true)

    const address = await connectToMetaMask()
    if (address) {
      const user = await signIn({ address: address })
      setUser(user)
    } else {
      setUser(null)
    }

    setIsButtonEnabled(true)
    setIsButtonLoading(false)
  }

  return (
    <>
      {user === undefined
        ? (
          <p>
            Loading
          </p>
        )
        : (
          <>
            {message && (
              <p>
                {message}
              </p>
            )}
            {user
              ?
              children
              : (
                <div>
                  <Button
                    onClick={onClickConnect}
                    isEnabled={isButtonEnabled}
                    isLoading={isButtonLoading}
                  >
                    Connect
                  </Button>
                </div>
              )}
          </>
        )}
    </>
  )

}

export default AuthProvider