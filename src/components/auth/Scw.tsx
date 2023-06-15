import * as s from "./style"
import { useState, useEffect, useRef, useContext } from "react"
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types"
import { ethers } from "ethers"
import SmartAccount from "@biconomy/smart-account"
import { useUserState } from "@/states/userState"
import Button from "../ui/Button"
import { SmartAccountContext } from "./AuthProvider"

export default function Scw() {
  const { smartAccount, setSmartAccount } = useContext(SmartAccountContext)

  const [interval, enableInterval] = useState(false)
  // const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      const newSmartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI],
        networkConfig: [
          {
            chainId: ChainId.POLYGON_MUMBAI,
            dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
          },
        ],
      })
      await newSmartAccount.init().then(() => {
        setSmartAccount(newSmartAccount)
      })
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
      {!smartAccount && <Button onClick={login}>Login</Button>}
      {smartAccount && (
        <div css={s.userInfo}>
          <h3>Smart account address:</h3>
          <p>{smartAccount.address}</p>
          <Button onClick={logout}>Logout</Button>
        </div>
      )}
    </div>
  )
}
