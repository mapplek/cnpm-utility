import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import Profile from 'components/profile'
 
const { publicClient } = configureChains(
    [goerli],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_MAINNET_ALCHEMY_API_KEY }),
        infuraProvider({ apiKey: process.env.NEXT_PUBLIC_MAINNET_INFURA_API_KEY }),
        publicProvider(),
    ],
)

const connector = new MetaMaskConnector({
    chains: [goerli]
})

const config = createConfig({
    autoConnect: false,
    connectors: [connector],
    publicClient,
})
 
export default function Home() {
  return (
    <WagmiConfig config={config}>
      <Profile />
    </WagmiConfig>
  )
}
