import AuthProvider from '@/components/auth/AuthProvider'
import Layout from '@/components/common/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <div>
        {/* <AuthProvider> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
        {/* </AuthProvider> */}
      </div>
    </RecoilRoot>
  )
}
