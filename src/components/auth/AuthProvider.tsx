import { signIn } from "@/models/auth/signIn"
import { asyncTask } from "@/utils/asyncTask"
import React, { Suspense, useEffect } from "react"
import { useUserState } from "@/states/userState"
import LoadingCircle from "../ui/LoadingCircle"
import UserNameDialog from "../user/UserNameDialog"
import Header from "../common/Header"
import { useAddress } from "@thirdweb-dev/react"
import dynamic from "next/dynamic"

type Props = {
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const account = useAddress()
  const [user, setUser] = useUserState()
  const hasNoUserName = user && !user.name

  const SocialLoginDynamic = dynamic(() => import("./Scw").then((res) => res.default), {
    ssr: false,
  })

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return (
    <>
      {user === undefined ? (
        <div>
          <p>Loading</p>
          <LoadingCircle />
        </div>
      ) : (
        <React.Fragment>
          {/* <Header /> */}
          <Suspense fallback={<div>Loading...</div>}>
            <SocialLoginDynamic />
          </Suspense>
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
