import { useState, useEffect, useMemo } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { formatUnits, Address, getContract } from 'viem';
import { getPublicClient } from '../utils/web3';
import { SUPPORTED_TOKENS } from '../constants/tokens';
import { AAVE_PRICE_ORACLE_ABI, AAVE_PRICE_ORACLE_ADDRESS } from '../constants/aaveOracle';

const ERC20_ABI = [
  {
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

export const useAssetBalances = () => {
  const [{ wallet }] = useConnectWallet();
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});

  const publicClient = useMemo(() => {
    if (wallet && wallet.chains && wallet.chains.length > 0) {
      const chainId = parseInt(wallet.chains[0].id, 16);
      return getPublicClient(chainId);
    }
    return null;
  }, [wallet]);

  useEffect(() => {
    const fetchBalancesAndPrices = async () => {
      if (!wallet || !publicClient) return;

      const address = wallet.accounts[0].address as Address;
      const newBalances: { [key: string]: string } = {};
      const newPrices: { [key: string]: number } = {};

      const priceOracle = getContract({
        address: AAVE_PRICE_ORACLE_ADDRESS,
        abi: AAVE_PRICE_ORACLE_ABI,
        publicClient,
      });

      for (const token of SUPPORTED_TOKENS) {
        try {
          // Fetch balance
          if (token.symbol === 'ETH') {
            const balance = await publicClient.getBalance({ address });
            newBalances[token.symbol] = formatUnits(balance, token.decimals);
          } else {
            const tokenContract = getContract({
              address: token.address as Address,
              abi: ERC20_ABI,
              publicClient,
            });
            // const balance = await tokenContract.read.balanceOf([address]);
            // newBalances[token.symbol] = formatUnits(balance, token.decimals);
          }

          // Fetch price
          const priceAddress = token.symbol === 'ETH' 
            ? '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e' // ETH address on Sepolia
            : token.address;
          const price = await priceOracle.read.getAssetPrice([priceAddress as Address]);
          newPrices[token.symbol] = parseFloat(formatUnits(price, 8)); // Aave prices are in 8 decimals

          console.log(`Fetched data for ${token.symbol}:`, {
            balance: newBalances[token.symbol],
            price: newPrices[token.symbol]
          });

        } catch (error) {
          console.error(`Error fetching data for ${token.symbol}:`, error);
        }
      }

      setBalances(newBalances);
      setPrices(newPrices);
    };

    fetchBalancesAndPrices();
    const intervalId = setInterval(fetchBalancesAndPrices, 60000);
    return () => clearInterval(intervalId);
  }, [wallet, publicClient]);

  return { balances, prices };
};