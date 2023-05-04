import AuthProvider from '@/components/common/AuthProvider'
import Layout from '@/components/common/Layout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Footer from "../components/common/Footer"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
      <Footer />
    </Layout>
  )
}
