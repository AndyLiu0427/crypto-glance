import React, { useEffect, useState } from 'react';
import { init, useConnectWallet } from '@web3-onboard/react';
import injectedModule from '@web3-onboard/injected-wallets';
import { Button, Typography, Box, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { createPublicClient, http, formatEther } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import { appIcon } from '../constants';

// 定義支持的鏈
const SUPPORTED_CHAINS = [
  {
    id: '0x1',
    name: 'Ethereum Mainnet',
    chain: mainnet,
    rpcUrl: 'https://eth.llamarpc.com'
  },
  {
    id: '0xaa36a7',
    name: 'Sepolia Testnet',
    chain: sepolia,
    rpcUrl: 'https://rpc.sepolia.org'
  },
];

// 初始化 Web3-Onboard
const injected = injectedModule();
init({
  wallets: [injected],
  chains: SUPPORTED_CHAINS.map(chain => ({
    id: chain.id,
    token: 'ETH',
    label: chain.name,
    rpcUrl: chain.rpcUrl
  })),
  appMetadata: {
    name: 'CryptoGlance',
    icon: appIcon,
    description: 'Web3 asset management tool'
  },
  connect: {
    autoConnectLastWallet: true
  }
});

const WalletConnect: React.FC = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [ethBalance, setEthBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  // console.log('wallet:', wallet);
  // console.log('connecting:', connecting);

  useEffect(() => {
    if (wallet) {
      const updateBalance = async () => {
        const chainId = await wallet.provider.request({ method: 'eth_chainId' });
        const currentChain = SUPPORTED_CHAINS.find(chain => chain.id === chainId);
        if (currentChain) {
          const publicClient = createPublicClient({
            chain: currentChain.chain,
            transport: http()
          });

          const balance = await publicClient.getBalance({ address: wallet.accounts[0].address as `0x${string}` });
          setEthBalance(formatEther(balance));
          setNetwork(currentChain.name);
        }
      };

      updateBalance();
    } else {
      setEthBalance(null);
      setNetwork(null);
    }
  }, [wallet]);

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    if (wallet) {
      disconnect(wallet);
    }
  };

  const handleNetworkChange = async (event: React.ChangeEvent<{ value: unknown }>) => {
    const newChainId = event.target.value as string;
    if (wallet) {
      try {
        await wallet.provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: newChainId }],
        });
      } catch (error) {
        console.error('Failed to switch network:', error);
      }
    }
  };

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{ minHeight: { xs: 'auto', md: 450 }, maxHeight: 'max-content' }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Connect Wallet
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Connect your cryptocurrency wallet to view your assets.
          </Typography>
        </CardContent>
        <CardContent>
          {!wallet && (
            <Button sx={{ width: '100%' }} variant="contained" onClick={handleConnect} disabled={connecting}>
              {connecting ? 'Connecting...' : 'Connect Wallet'}
            </Button>
          )}
          {wallet && (
            <Box>
              <Typography variant="body1">
                Connected: {wallet.accounts[0].address.slice(0, 6)}...{wallet.accounts[0].address.slice(-4)}
              </Typography>
              <Typography variant="body1">Network: {network}</Typography>
              <Typography variant="body1">ETH Balance: {ethBalance}</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel id="network-select-label">Network</InputLabel>
                <Select
                  labelId="network-select-label"
                  id="network-select"
                  value={SUPPORTED_CHAINS.find(chain => chain.name === network)?.id || ''}
                  label="Network"
                  onChange={handleNetworkChange}
                >
                  {SUPPORTED_CHAINS.map((chain) => (
                    <MenuItem key={chain.id} value={chain.id}>
                      {chain.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleDisconnect} sx={{ width: '100%', mt: 2 }}>
                Disconnect
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WalletConnect;