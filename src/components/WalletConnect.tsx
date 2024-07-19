import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material'
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'


const WalletConnect = () => {
  return (
    <>
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
          </CardContent>
          <CardActions sx={{ py: 2 }}>
            <Button
              sx={{ mx: 'auto' }}
              variant="contained"
              startIcon={<WalletIcon />}
            >
              Connect Wallet
            </Button>
          </CardActions>
        </Card>
      </Box>
    </>
  )
}

export default WalletConnect