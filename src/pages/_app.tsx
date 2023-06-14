import AuthProvider from "@/components/auth/AuthProvider"
import Layout from "@/components/common/Layout"
import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { RecoilRoot } from "recoil"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import "@biconomy/web3-auth/dist/src/style.css"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <DndProvider backend={HTML5Backend}>
        <AuthProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </AuthProvider>
      </DndProvider>
    </RecoilRoot>
  )
}
