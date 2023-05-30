import AuthProvider from "@/components/auth/AuthProvider"
import Layout from "@/components/common/Layout"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { RecoilRoot } from "recoil"
import { NotificationProvider } from "web3uikit"
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <RecoilRoot>
          <DndProvider backend={HTML5Backend}>
            <AuthProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </AuthProvider>
          </DndProvider>
        </RecoilRoot>
      </NotificationProvider>
    </MoralisProvider>
  )
}
