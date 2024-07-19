import { Box, Card, CardContent, Typography } from '@mui/material'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'
import { Profile } from './profile'
import { WalletOptions } from './WalletOptions'
import { Account } from './Account'

const queryClient = new QueryClient()

function ConnectWallet() {
  const { isConnected } = useAccount()
  if (isConnected) return <Account />
  return <WalletOptions />
}

const WalletConnect = () => {
  return (
    <>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <Box sx={{ minWidth: 275 }}>
            <Card
              variant="outlined"
              sx={{ minHeight: { xs: 'auto', md: 600 } }}
            >
              <CardContent>
                <Typography variant="h5" component="div">
                  Connect Wallet
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  Connect your cryptocurrency wallet to view your asset portfolio.
                </Typography>
                
                <Profile />

                <ConnectWallet />
              </CardContent>
            </Card>
          </Box>
        </QueryClientProvider>
      </WagmiProvider>
    </>
  )
}

export default WalletConnect