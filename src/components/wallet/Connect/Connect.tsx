import { BaseProvider } from "@metamask/providers"
import { ethers } from "ethers"
import { useEffect, useState } from "react"

const Connect: React.FC = () => {
  const [ethereum, setEthereum] = useState<BaseProvider | null>(null)
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [balance, setBalance] = useState<string>("")

  useEffect(() => {
    const ethereumProvider = (window as any).ethereum as BaseProvider ?? null
    setEthereum(ethereumProvider)

    const browserProvider = new ethers.providers.Web3Provider(ethereumProvider) ?? null
    setProvider(browserProvider)
  }, [])

  const onClickConnect = async () => {
    if (!ethereum) { return }
    if (!provider) { return }

    try {
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as string[]
      let balance = await provider.getBalance(accounts[0])
      let formatted = ethers.utils.formatEther(balance)
      setBalance(formatted)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      {ethereum
        ? (
          <div>
            Balance:
            {balance}
          </div>
        )
        : (
          <p>no metamask</p>
        )
      }
      <button onClick={onClickConnect}>Connect</button>
    </div>
  )

}

export default Connect