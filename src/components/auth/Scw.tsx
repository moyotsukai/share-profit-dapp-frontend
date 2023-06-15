import { useState, useEffect, useRef } from "react"
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types"
import { ethers } from "ethers"
import SmartAccount from "@biconomy/smart-account"
import { signIn } from "@/models/auth/signIn"
import { createUser } from "@/models/firestore/createUser"
import { getUser } from "@/models/firestore/getUser"
import { useUserState } from "@/states/userState"
import Button from "../ui/Button"

export default function Scw() {
  const [interval, enableInterval] = useState(false)
  const sdkRef = useRef<SocialLogin | null>(null)
  const [user, setUser] = useUserState()

  useEffect(() => {
    let configureLogin: any
    if (interval) {
      configureLogin = setInterval(() => {
        if (sdkRef.current?.provider) {
          setupSmartAccount()
          clearInterval(configureLogin)
        }
      }, 1000)
    }
  }, [interval])

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin()
      const signature1 = await socialLoginSDK.whitelistUrl("http://localhost:3000/")
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        // network: "testnet",
        whitelistUrls: {
          "http://localhost:3000/": signature1,
        },
      })
      sdkRef.current = socialLoginSDK
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet()
      enableInterval(true)
    } else {
      setupSmartAccount()
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return
    sdkRef.current.hideWallet()
    const web3Provider = new ethers.providers.Web3Provider(sdkRef.current.provider)
    try {
      const smartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
        networkConfig: [
          {
            chainId: ChainId.POLYGON_MUMBAI,
            dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
          },
        ],
      })
      await smartAccount.init()

      // user setup
      const address = smartAccount?.address
      if (!address) {
        return
      }
      const authenticatedUser = await signIn({ address: address })
      if (!authenticatedUser) { return }
      const { data: existingUserData } = await getUser(authenticatedUser.uid)
      if (!existingUserData) {
        const { data: createdUser } = await createUser({
          uid: authenticatedUser.uid,
          name: "",
        })
        console.log("createdUser: ", createdUser)
        if (!createdUser) {
          return
        }
        setUser({
          ...createdUser,
          smartAccount: smartAccount
        })
        console.log("user: ", user)
      } else {
        setUser({
          ...authenticatedUser,
          smartAccount: smartAccount
        })
      }
    } catch (err) {
      console.log("error setting up smart account... ", err)
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.")
      return
    }
    await sdkRef.current.logout()
    sdkRef.current.hideWallet()
    enableInterval(false)

    setUser(null)
  }

  return (
    <div>
      {!user?.smartAccount && (
        <Button
          onClick={login}
        >
          Login
        </Button>
      )}
      {user?.smartAccount && (
        <div>
          <h3>Smart account address:</h3>
          <p>{user?.smartAccount.address}</p>
          <Button
            onClick={logout}
          >
            Logout
          </Button>
        </div>
      )}
    </div>
  )
}
