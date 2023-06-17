import * as s from "./style"
import { useState, useEffect, useContext } from "react"
import SocialLogin from "@biconomy/web3-auth"
import { ChainId } from "@biconomy/core-types"
import { ethers } from "ethers"
import SmartAccount from "@biconomy/smart-account"
import { useUserState } from "@/states/userState"
import Button from "../ui/Button"
import { SmartAccountContext, SocialLoginContext } from "./AuthProvider"

const truncateStr = (fullStr: string, strLen: number) => {
  if (fullStr.length <= strLen) return

  const separator = "..."
  const separatorLen = separator.length
  const charsToShow = strLen - separatorLen
  const frontChars = Math.ceil(charsToShow / 2)
  const backChars = Math.floor(charsToShow / 2)
  return (
    fullStr.substring(0, frontChars) + separator + fullStr.substring(fullStr.length - backChars)
  )
}

export default function Scw({
  isSetting,
  setIsSetting,
}: {
  isSetting: boolean
  setIsSetting: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const { setSmartAccount, setProvider } = useContext(SmartAccountContext)
  const { sdkRef } = useContext(SocialLoginContext)

  const [interval, enableInterval] = useState<boolean>(false)
  const [user, setUser] = useUserState()

  useEffect(() => {
    let configureLogin: any
    if (interval) {
      configureLogin = setInterval(() => {
        if (sdkRef?.current?.provider) {
          setupSmartAccount()
          clearInterval(configureLogin)
        }
      }, 1000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval])

  async function login() {
    console.log("user", user)
    setIsSetting(true)
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
    setProvider(web3Provider)
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
        console.log("Your smart account address: ", newSmartAccount.address)
      })
    } catch (err) {
      console.log("error setting up smart account... ", err)
    }
    setIsSetting(false)
  }

  const logout = async () => {
    if (!user?.socialLogin) {
      console.error("Web3Modal not initialized.")
      return
    }
    await user?.socialLogin.logout()
    user?.socialLogin.hideWallet()
    enableInterval(false)

    sdkRef.current = null
    setUser(undefined)
    setSmartAccount(null)
  }
  console.log("user", user)

  return (
    <div>
      {!user?.smartAccount &&
        (!isSetting ? (
          <Button onClick={login}>Login</Button>
        ) : (
          <p>setting up your Smart Account...</p>
        ))}
      {user?.smartAccount && (
        <div css={s.userInfo}>
          <div css={s.userAddr}>
            <p>Smart Account address</p>
            <p>{truncateStr(user?.smartAccount.address, 15)}</p>
          </div>
          <div css={s.button}>
            <Button onClick={logout}>Logout</Button>
          </div>
        </div>
      )}
    </div>
  )
}
