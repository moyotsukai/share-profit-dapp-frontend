import React, { createContext, useEffect, useState } from "react"
import { useUserState, useUserValue } from "@/states/userState"
import LoadingCircle from "../ui/LoadingCircle"
import UserNameDialog from "../user/UserNameDialog"
import dynamic from "next/dynamic"
import SmartAccount from "@biconomy/smart-account"
import { asyncTask } from "@/utils/asyncTask"
import { signIn } from "@/models/auth/signIn"

type Props = {
  children: React.ReactNode
}

export const SmartAccountContext = createContext<{
  smartAccount: SmartAccount | null
  setSmartAccount: React.Dispatch<React.SetStateAction<SmartAccount | null>>
}>({ smartAccount: null, setSmartAccount: () => {} })

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useUserState()
  const hasNoUserName = user && !user.name
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
  const SocialLoginDynamic = dynamic(() => import("./Scw").then((res) => res.default), {
    ssr: false,
  })

  useEffect(() => {
    console.log(smartAccount)
    // user setup
    const address = smartAccount?.address
    if (!address) {
      return
    }
    asyncTask(async () => {
      const authenticatedUser = await signIn({ address: address })
      console.log("authenticatedUser: ", authenticatedUser)
      if (!authenticatedUser) {
        return
      }
      setUser({ ...authenticatedUser })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartAccount])

  return (
    <>
      <SmartAccountContext.Provider value={{ smartAccount, setSmartAccount }}>
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
      </SmartAccountContext.Provider>
    </>
  )
}

export default AuthProvider
