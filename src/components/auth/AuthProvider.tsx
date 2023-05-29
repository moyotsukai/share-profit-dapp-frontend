import { connectToMetaMask } from "@/models/auth/connectToMetaMask"
import { signIn } from "@/models/auth/signIn"
import { ethereum } from "@/models/ethereum/ethereum"
import { asyncTask } from "@/utils/asyncTask"
import React, { useEffect, useState } from "react"
import Button from "../ui/Button"
import { useUserState } from "@/states/userState"
import LoadingCircle from "../ui/LoadingCircle"
import { useMoralis } from "react-moralis"
import { ConnectButton } from "web3uikit"

type Props = {
  children: React.ReactNode
}

const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useUserState()
  const [message, setMessage] = useState<string>("")
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(true)
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false)

  const { account } = useMoralis()

  // useEffect(() => {
  //   if (user) {
  //     //user is already signed in
  //     //do nothing
  //   } else {
  //     if (ethereum) {
  //       // metamaskから以前アドレスを取得したことがある場合
  //       // このアドレスをmoralisから取得
  //       const address = account
  //       if (address) {
  //         //connected, sign in
  //         asyncTask(async () => {
  //           const authenticatedUser = await signIn({ address: address })
  //           setUser(authenticatedUser)
  //         })
  //       } else {
  //         //not connected, user needs to connect and sign in manually
  //         setUser(null)
  //       }
  //     } else {
  //       //user needs to install MetaMask
  //       setMessage("Please install MetaMask")
  //       setUser(null)
  //     }
  //   }
  // }, [])

  const onClickConnect = async () => {
    // setIsButtonEnabled(false)
    // setIsButtonLoading(true)

    // const address = await connectToMetaMask()
    // if (address) {
    //   const user = await signIn({ address: address })
    //   setUser(user)
    // } else {
    //   setUser(null)
    // }

    // setIsButtonEnabled(true)
    // setIsButtonLoading(false)

    // Hashimoto>>>
    const address = account
    if (address) {
      const user = await signIn({ address: address })
      setUser(user)
    } else {
      setUser(null)
    }
    // <<<Hashimoto
  }

  return (
    <React.Fragment>
      {user === undefined ? (
        <div>
          <p>Loading</p>
          <LoadingCircle />
        </div>
      ) : (
        <React.Fragment>
          {message && <p>{message}</p>}
          {user ? (
            children
          ) : (
            <div>
              {/* <Button
                onClick={onClickConnect}
                isEnabled={isButtonEnabled}
                isLoading={isButtonLoading}
              >
                Connect MetaMask
              </Button> */}
              <ConnectButton onClick={onClickConnect} />
            </div>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default AuthProvider
