import { signIn } from "@/models/auth/signIn"
import { asyncTask } from "@/utils/asyncTask"
import React, { useEffect } from "react"
import { useUserState } from "@/states/userState"
import LoadingCircle from "../ui/LoadingCircle"
import { useMoralis } from "react-moralis"
import UserNameDialog from "../user/UserNameDialog";

type Props = {
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {

  const { account } = useMoralis()
  const [user, setUser] = useUserState();
  const hasNoUserName = !user?.name

  useEffect(() => {
    if (user) {
      //user is already signed in
      //do nothing
    } else {
      const address = account
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
    }
  }, [])

  return (
    <React.Fragment>
      {user === undefined ? (
        <div>
          <p>Loading</p>
          <LoadingCircle />
        </div>
      ) : (
        <React.Fragment>
          {user ? (
            hasNoUserName ? (
              <UserNameDialog />
            ) :
              children
          ) : (
            <div>
              Landing page
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default AuthProvider
