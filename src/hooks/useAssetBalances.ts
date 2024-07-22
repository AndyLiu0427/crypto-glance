import { useState, useEffect, useMemo } from 'react';
import { useConnectWallet } from '@web3-onboard/react';
import { formatUnits, Address, PublicClient, WalletClient, getContract, GetContractResult } from 'viem';
import { getPublicClient } from '../utils/web3';
import { SUPPORTED_TOKENS } from '../constants/tokens';
import { AAVE_PRICE_ORACLE_ABI, AAVE_PRICE_ORACLE_ADDRESS } from '../constants/aaveOracle';
import { ERC20_ABI } from '../constants';


export const useAssetBalances = () => {
  const [{ wallet }] = useConnectWallet();
  const [balances, setBalances] = useState<{ [key: string]: string }>({});
  const [prices, setPrices] = useState<{ [key: string]: number }>({});
  const [usdValues, setUsdValues] = useState<{ [key: string]: number }>({});

  const clients = useMemo(() => {
    if (wallet && wallet.provider) {
      const chainId = parseInt(wallet.chains[0].id, 16);
      console.log('Chain ID:', chainId);
      return getPublicClient(chainId);
    }
    return null;
  }, [wallet]);

  useEffect(() => {
    const fetchBalancesAndPrices = async () => {
      if (!wallet || !clients) {
        console.log('Wallet or clients not available');
        return;
      }

      const address = wallet.accounts[0].address as `0x${string}`;
      const newBalances: { [key: string]: string } = {};
      const newPrices: { [key: string]: number } = {};
      const newUsdValues: { [key: string]: number } = {};

      const priceOracle = getContract({
        address: AAVE_PRICE_ORACLE_ADDRESS as `0x${string}`,
        abi: AAVE_PRICE_ORACLE_ABI,
        client: clients,
      });

      for (const token of SUPPORTED_TOKENS) {
        try {
          let balance;
          if (token.symbol === 'ETH') {
            balance = await clients.getBalance({ address });
          } else {
            const tokenContract = getContract({
              address: token.address as `0x${string}`,
              abi: ERC20_ABI,
              client: clients,
            });
            balance = await tokenContract.read.balanceOf([address]);
          }
          const formattedBalance = formatUnits(balance as bigint, token.decimals);
          newBalances[token.symbol] = formattedBalance;

          const priceAddress = token.address;
          const price = await priceOracle.read.getAssetPrice([priceAddress as `0x${string}`]);
          const formattedPrice = parseFloat(formatUnits(price as bigint, 8)); // Aave prices are in 8 decimals
          newPrices[token.symbol] = formattedPrice;

          const usdValue = parseFloat(formattedBalance) * formattedPrice;
          newUsdValues[token.symbol] = usdValue;

          console.log(`Fetched data for ${token.symbol}:`, {
            balance: formattedBalance,
            price: formattedPrice,
            usdValue
          });
        } catch (error) {
          console.error(`Error fetching data for ${token.symbol}:`, error);
          newBalances[token.symbol] = '0';
          newPrices[token.symbol] = 0;
        }
      }

      setBalances(newBalances);
      setPrices(newPrices);
      setUsdValues(newUsdValues);
    };

    fetchBalancesAndPrices();
    // const intervalId = setInterval(fetchBalancesAndPrices, 60000);
    // return () => clearInterval(intervalId);
  }, [wallet, clients]);

  return { balances, prices, usdValues };
};