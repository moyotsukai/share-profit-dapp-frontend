import { signIn } from "@/models/auth/signIn"
import { asyncTask } from "@/utils/asyncTask"
import React, { useEffect } from "react"
import { useUserState } from "@/states/userState"
import LoadingCircle from "../ui/LoadingCircle"
import UserNameDialog from "../user/UserNameDialog"
import Header from "../common/Header"

type Props = {
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useUserState()
  const address = user?.uid
  console.log("user: :", user)
  const hasNoUserName = user && !user.name
  console.log("hasNoUserName: ", hasNoUserName)

  useEffect(() => {
    if (user) {
      //user is already signed in
      //do nothing
    } else {
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
  }, [user])

  return (
    <>
      <Header user={user} setUser={setUser} />
      {user === undefined ? (
        <div>
          {/* <p>Loading</p>
          <LoadingCircle /> */}
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

// import { useState, useEffect, useRef } from "react"
// import SocialLogin from "@biconomy/web3-auth"
// import { ChainId } from "@biconomy/core-types"
// import { ethers } from "ethers"
// import SmartAccount from "@biconomy/smart-account"
// import { useSetUserState, useUserState } from "@/states/userState"
// import { signIn } from "@/models/auth/signIn"
// import { createUser } from "@/models/firestore/createUser"
// import { getUser } from "@/models/firestore/getUser"
// import Header from "../common/Header/Header"
// import UserNameDialog from "../user/UserNameDialog/UserNameDialog"

// type Props = {
//   children: React.ReactNode
// }

// const AuthProvider: React.FC<Props> = ({ children }) => {
//   const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
//   const [interval, enableInterval] = useState(false)
//   const sdkRef = useRef<SocialLogin | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [provider, setProvider] = useState<any>(null)
//   const [user, setUser] = useUserState()
//   const hasNoUserName = user && !user.name

//   useEffect(() => {
//     let configureLogin: any
//     if (interval) {
//       configureLogin = setInterval(() => {
//         if (!!sdkRef.current?.provider) {
//           setupSmartAccount()
//           clearInterval(configureLogin)
//         }
//       }, 1000)
//     }
//   }, [interval])

//   async function login() {
//     if (!sdkRef.current) {
//       const socialLoginSDK = new SocialLogin()
//       const signature1 = await socialLoginSDK.whitelistUrl("http://localhost:3000/")
//       await socialLoginSDK.init({
//         chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
//         // network: "testnet",
//         whitelistUrls: {
//           "http://localhost:3000/": signature1,
//         },
//       })
//       sdkRef.current = socialLoginSDK
//     }
//     if (!sdkRef.current.provider) {
//       sdkRef.current.showWallet()
//       enableInterval(true)
//     } else {
//       setupSmartAccount()
//     }
//   }

//   async function setupSmartAccount() {
//     if (!sdkRef?.current?.provider) return
//     sdkRef.current.hideWallet()
//     setLoading(true)
//     const web3Provider = new ethers.providers.Web3Provider(sdkRef.current.provider)
//     setProvider(web3Provider)
//     try {
//       const smartAccount = new SmartAccount(web3Provider, {
//         activeNetworkId: ChainId.POLYGON_MUMBAI,
//         supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
//         networkConfig: [
//           {
//             chainId: ChainId.POLYGON_MUMBAI,
//             dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
//           },
//         ],
//       })
//       await smartAccount.init()
//       setSmartAccount(smartAccount)
//       setLoading(false)
//     } catch (err) {
//       console.log("error setting up smart account... ", err)
//     }
//   }

//   const logout = async () => {
//     if (!sdkRef.current) {
//       console.error("Web3Modal not initialized.")
//       return
//     }
//     await sdkRef.current.logout()
//     sdkRef.current.hideWallet()
//     setSmartAccount(null)
//     enableInterval(false)

//     setUser(null)
//   }

//   const onClickLogin = async () => {
//     await login()
//     const address = smartAccount?.address
//     if (!address) {
//       return
//     }
//     const authenticatedUser = await signIn({ address: address })
//     if (!authenticatedUser) {
//       return
//     }
//     const { data: existingUserData } = await getUser(authenticatedUser.uid)
//     if (!existingUserData) {
//       const { data: createdUser } = await createUser({
//         uid: authenticatedUser.uid,
//         name: "",
//         smartAccount: smartAccount,
//       })
//       if (!createdUser) {
//         return
//       }
//       setUser(createdUser)
//     } else {
//       setUser(authenticatedUser)
//     }
//   }

//   return (
//     <div>
//       {!smartAccount && !loading && <button onClick={onClickLogin}>Login</button>}
//       {loading && <p>Loading account details...</p>}
//       {!!smartAccount && (
//         <div>
//           <Header logout={logout} />
//           {hasNoUserName ? (
//             <UserNameDialog />
//           ) : (children)}
//         </div>
//       )}
//     </div>
//     // <>
//     //       {user === undefined ? (
//     //          <div>
//     //            <p>Loading</p>
//     //            <LoadingCircle />
//     //          </div>
//     //        ) : (
//     //          <React.Fragment>
//     //            <Header />
//     //            {user ? (
//     //              hasNoUserName ? (
//     //                <UserNameDialog />
//     //              ) : (
//     //                children
//     //              )
//     //            ) : (
//     //              <>
//     //                <>Landing page</>
//     //              </>
//     //            )}
//     //          </React.Fragment>
//     //        )}
//     //      </>
//   )
// }

// export default AuthProvider
