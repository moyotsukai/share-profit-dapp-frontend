import React from "react"
import { useUserValue } from "@/states/userState"
import LoadingCircle from "../ui/LoadingCircle"
import UserNameDialog from "../user/UserNameDialog"
import dynamic from "next/dynamic"
import Scw from "./Scw"

type Props = {
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const user = useUserValue()
  const hasNoUserName = user && !user.name
  const SocialLoginDynamic = dynamic(() => import("./Scw").then((res) => res.default), {
    ssr: false,
  })

  // useEffect(() => {
  //   if (user) {
  //     //user is already signed in
  //     //do nothing
  //   } else {
  //     if (address) {
  //       //connected, sign in
  //       asyncTask(async () => {
  //         const authenticatedUser = await signIn({ address: address })
  //         setUser(authenticatedUser)
  //       })
  //     } else {
  //       //not connected, user needs to connect and sign in manually
  //       setUser(null)
  //     }
  //   }
  // }, [user])

  return (
    <>
      <SocialLoginDynamic />
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
            ) : (
              children
            )
          ) : (
            <>
              <>Landing page</>
            </>
          )}
        </React.Fragment>
      )}
    </>
  )
}

export default AuthProvider
