import AuthProvider from "@/components/auth/AuthProvider";
import Layout from "@/components/common/Layout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { RecoilRoot } from "recoil";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { goerli } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { NotificationProvider } from "web3uikit";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [goerli],
  [
    alchemyProvider({
      apiKey: "o7KyLmR_M_WjlEKX1P7bcG7oBAHqte8t",
    }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <RecoilRoot>
        <AuthProvider>
          <NotificationProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NotificationProvider>
        </AuthProvider>
      </RecoilRoot>
    </WagmiConfig>
  );
}
