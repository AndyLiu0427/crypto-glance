import { http, createConfig } from 'wagmi'
import { base, mainnet, optimism } from 'wagmi/chains'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const projectId = '8ad59fbbcd8830a02e341f4c4f7cfd3b'

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    // injected(),
    // walletConnect({ projectId }),
    // metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
  },
})