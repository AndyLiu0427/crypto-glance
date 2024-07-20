import { init, useConnectWallet } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import { createPublicClient, http, createWalletClient, custom } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

const injected = injectedModule();

init({
  wallets: [injected],
  chains: [
    {
      id: '0x1',
      token: 'ETH',
      label: 'Ethereum Mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_ID'
    },
    {
      id: '0xaa36a7',
      token: 'SEP',
      label: 'Sepolia',
      rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_ID'
    }
  ],
  appMetadata: {
    name: 'CryptoGlance',
    icon: '<svg>...</svg>',
    description: 'Web3 asset management tool'
  },
  connect: {
    autoConnectLastWallet: true
  }
});

export function useWeb3() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();

  const publicClient = createPublicClient({
    chain: mainnet,
    transport: http()
  });

  const getWalletClient = () => {
    if (wallet) {
      return createWalletClient({
        chain: mainnet,
        transport: custom(wallet.provider)
      });
    }
    return null;
  };

  return { wallet, connecting, connect, disconnect, publicClient, getWalletClient };
}