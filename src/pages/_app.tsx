import AuthProvider from '@/components/common/AuthProvider'
import Layout from '@/components/common/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      {/* <AuthProvider> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {/* </AuthProvider> */}
    </div>
  )
}
