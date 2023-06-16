import React, { createContext, useEffect, useRef, useState } from "react"
import { useUserState, useUserValue } from "@/states/userState"
import LoadingCircle from "../ui/LoadingCircle"
import UserNameDialog from "../user/UserNameDialog"
import dynamic from "next/dynamic"
import SmartAccount from "@biconomy/smart-account"
import { asyncTask } from "@/utils/asyncTask"
import { signIn } from "@/models/auth/signIn"
import SocialLogin from "@biconomy/web3-auth"

type Props = {
  children: React.ReactNode
}

export const SmartAccountContext = createContext<{
  smartAccount: SmartAccount | null
  setSmartAccount: React.Dispatch<React.SetStateAction<SmartAccount | null>>
}>({ smartAccount: null, setSmartAccount: () => {} })

export const SocialLoginContext = createContext<{
  sdkRef: React.MutableRefObject<SocialLogin | null | undefined>
}>({ sdkRef: { current: null } })

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useUserState()
  const hasNoUserName = user && !user.name
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
  const sdkRef = useRef<SocialLogin | null | undefined>(null)

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
      setUser({...authenticatedUser})
      // setUser({ ...authenticatedUser, socialLogin: sdkRef.current })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smartAccount])
  console.log(sdkRef.current)
  console.log("usr", user)

  return (
    <>
      <SocialLoginContext.Provider value={{ sdkRef }}>
        <SmartAccountContext.Provider value={{ smartAccount, setSmartAccount }}>
          <SocialLoginDynamic />
          {user === undefined ? (
            <div>
              <p>Login Page</p>
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
      </SocialLoginContext.Provider>
    </>
  )
}

export default AuthProvider
