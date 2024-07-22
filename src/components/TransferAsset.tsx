import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel, Box, useTheme, useMediaQuery, Typography, Snackbar, Alert } from '@mui/material';
import { useConnectWallet } from '@web3-onboard/react';
import { parseUnits, createWalletClient, custom, Address, http, createPublicClient, parseEther, publicActions, formatEther, Hash } from 'viem';
import { normalize } from "viem/ens";
import { mainnet, sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { ERC20_ABI } from '../constants';
import { Core } from '@quicknode/sdk';

interface TransferAssetProps {
  assets: { symbol: string; address: string; decimals: number; icon?: string; }[];
  onTransferComplete: () => void;
}

export const TransferAsset: React.FC<TransferAssetProps> = ({ assets, onTransferComplete }) => {
  const [{ wallet }] = useConnectWallet();
  const [open, setOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info'>('info');


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showNotification = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleTransfer = async () => {
    if (!wallet || !selectedAsset || !recipientAddress || !amount) return;

    const asset = assets.find(a => a.symbol === selectedAsset);
    if (!asset) return;

    // Retrieve QuickNode endpoint and private key from environment variables
    const QUICKNODE_ENDPOINT = import.meta.env.VITE_QUICKNODE_ENDPOINT as string;
    const PRIVATE_KEY = import.meta.env.VITE_PRIVATE_KEY as Address;

    // Convert the private key to an account object
    const account = privateKeyToAccount(PRIVATE_KEY);

    // Create a wallet client with the specified account, chain, and HTTP transport
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(QUICKNODE_ENDPOINT),
    }).extend(publicActions);

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(QUICKNODE_ENDPOINT),
    }).extend(publicActions);

    // Define the amount of ETH to send
    const ethAmount = parseEther(amount);

    // Function to check the sender's balance and ensure it's sufficient
    async function checkBalance() {
      const balanceFrom = await walletClient.getBalance({
        address: account.address,
      });

      if (balanceFrom < ethAmount) {
        throw new Error("Insufficient ETH balance.");
      }

      console.log(
        `The balance of the sender (${account.address}) is: ${formatEther(balanceFrom)} ETH`
      );
    }

    setIsLoading(true);
    showNotification('Initiating transfer...', 'info');

    try {
      let hash: Hash;

      if (asset.symbol === 'ETH') {
        const contractABI = [
          {
            constant: false,
            inputs: [],
            name: "deposit",
            outputs: [],
            payable: true,
            stateMutability: "payable",
            type: "function",
          },
        ];

        const { request } = await walletClient.simulateContract({
          account,
          address: asset.address as Address,
          abi: contractABI,
          functionName: "deposit",
          value: parseEther(amount),
          // args: [arg1, arg2, ...]
        });

        hash = await walletClient.writeContract(request);
        console.log('Transaction hash:', hash);

        const unwatch = walletClient.watchContractEvent({
          address: asset.address as Address,
          abi: contractABI,
          eventName: 'deposit',
          onLogs: (logs) => {
            console.log('Transfer event detected:', logs);
            showNotification(`Transfer of ${amount} ${asset.symbol} confirmed on blockchain`, 'success');
            unwatch();
          },
        });
        // console.log('unwatch:', unwatch);
      } else {
        // Initialize the clients
        const core = new Core({
          endpointUrl: QUICKNODE_ENDPOINT // YOUR_QUICKNODE_ENDPOINT,
        });
        console.log('Core:', core);
        const { request } = await core.client.simulateContract({
          address: asset.address as Address,
          abi: ERC20_ABI,
          functionName: 'transfer',
          args: [account.address, parseUnits(amount, asset.decimals)],
          account
        });
        hash = await walletClient.writeContract(request);
        console.log('Transaction sent. Transaction hash:', hash);
      }

      showNotification(`Transaction sent. Hash: ${hash}`, 'info');

      // Watch for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        showNotification(`Transfer of ${amount} ${asset.symbol} successful!`, 'success');
        onTransferComplete();
      } else {
        showNotification('Transfer failed', 'error');
      }

      // Watch for Transfer event (for ERC20 tokens)
      if (asset.symbol !== 'ETH') {
        const unwatch = walletClient.watchContractEvent({
          address: asset.address as Address,
          abi: ERC20_ABI,
          eventName: 'transfer',
          args: {
            from: account.address,
            to: recipientAddress as Address,
          },
          onLogs: (logs) => {
            console.log('Transfer event detected:', logs);
            showNotification(`Transfer of ${amount} ${asset.symbol} confirmed on blockchain`, 'success');
            unwatch();
          },
        });
      }

      console.log('Transfer successful');
      handleClose();
    } catch (error) {
      console.error('Transfer failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={handleOpen}>Transfer Asset</Button>
      <Dialog
        onClose={handleClose}
        open={open}
      >
        <DialogTitle>Transfer Asset</DialogTitle>
        <DialogContent sx={{ minWidth: { xs: 350, md: 500 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <Typography>Asset</Typography>
              <Select
                value={selectedAsset}
                onChange={(e) => setSelectedAsset(e.target.value as string)}
              >
                {assets.map((asset) => (
                  <MenuItem key={asset.symbol} value={asset.symbol}>
                    <Box sx={{ display: 'flex' }}>
                      {asset.icon && <img src={asset.icon} alt={asset.symbol} width="24" height="24" />}
                      <Box sx={{ ml: 1 }}>
                        {asset.symbol}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box>
              <Typography>Recipient Address</Typography>
              <TextField
                fullWidth
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
            </Box>
            <Box>
              <Typography>Amount</Typography>
              <TextField
                fullWidth
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ mb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleTransfer} variant="contained">Transfer</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};