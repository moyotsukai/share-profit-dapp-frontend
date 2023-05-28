import AuthProvider from "@/components/auth/AuthProvider"
import Layout from "@/components/common/Layout"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { RecoilRoot } from "recoil"
import { NotificationProvider } from "web3uikit"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <RecoilRoot>
          <AuthProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AuthProvider>
        </RecoilRoot>
      </NotificationProvider>
    </MoralisProvider>
  )
}
