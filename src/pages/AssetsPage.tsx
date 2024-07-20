import WalletConnect from '../components/WalletConnect'
import AssetOverview from '../components/AssetOverview'
import AssetList from '../components/AssetList'
import { Box } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';

const AssetsPage = () => {

  return (
    <Box sx={{
      flexGrow: 1,
      height: '100vh',
    }}>
      <Grid
        container
        spacing={3}
        sx={{
          mt: 4,
          px: 4,
        }}
      >
        <Grid xs={12} md={4}>
          <WalletConnect />
        </Grid>
        <Grid xs={12} md={4}>
          <AssetOverview />
        </Grid>
        <Grid xs={12} md={4}>
          <AssetList />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AssetsPage