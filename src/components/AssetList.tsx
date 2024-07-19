import { Box, Card, CardContent, Typography } from "@mui/material"

const AssetList = () => {
  return (
    <>
      <Box sx={{ minWidth: 275 }}>
        <Card
          variant="outlined"
          sx={{ minHeight: { xs: 'auto', md: 600 } }}
        >
          <CardContent>
            <Typography variant="h5" component="div">
              Asset List
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              View your cryptocurrency assets and their current value.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default AssetList