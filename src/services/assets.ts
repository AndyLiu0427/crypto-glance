// src/services/assets.ts
import { useAccount, useProvider } from 'wagmi'
import { ethers } from 'ethers'
import axios from 'axios'

const ERC20_ABI = [/* ERC20 ABI here */]

export const getAssetData = async (address: string) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const contract = new ethers.Contract(address, ERC20_ABI, provider)
  const balance = await contract.balanceOf(address)
  const decimals = await contract.decimals()
  const symbol = await contract.symbol()
  const price = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${symbol.toLowerCase()}&vs_currencies=usd`)
  const usdValue = (balance / 10 ** decimals) * price.data[symbol.toLowerCase()].usd
  return { symbol, balance: balance.toString(), usdValue }
}
