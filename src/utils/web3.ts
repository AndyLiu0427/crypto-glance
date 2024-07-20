import { useConnectWallet } from '@web3-onboard/react';
import { createPublicClient, createWalletClient, custom, http, PublicClient } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

type ChainId = typeof mainnet.id | typeof sepolia.id

const clients: Record<ChainId, PublicClient> = {
  [mainnet.id]: createPublicClient({
    chain: mainnet,
    transport: http()
  }),
  [sepolia.id]: createPublicClient({
    chain: sepolia,
    transport: http()
  }),
};

export const getPublicClient = (chainId: number): PublicClient => {
  return clients[chainId as ChainId] || clients[mainnet.id];
};
