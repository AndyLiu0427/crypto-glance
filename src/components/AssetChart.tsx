import { Box, Card, CardContent, Typography } from "@mui/material"

const AssetChart = () => {
  return (
    <>
      <Box sx={{ minWidth: 275 }}>
        <Card
          variant="outlined"
          sx={{ minHeight: { xs: 'auto', md: 600 } }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Asset Value
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              Breakdown of your total asset value across different cryptocurrencies.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default AssetChart