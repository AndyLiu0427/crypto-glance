import { Box, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useAssetBalances } from '../hooks/useAssetBalances';
import { SUPPORTED_TOKENS } from "../constants/tokens";
import { TransferAsset } from "./TransferAsset";

const AssetList: React.FC = () => {
  const { balances, prices, usdValues } = useAssetBalances();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  const totalValue = SUPPORTED_TOKENS.reduce((sum, token) => {
    const balance = parseFloat(balances[token.symbol] || '0');
    const price = prices[token.symbol] || 0;
    return sum + balance * price;
  }, 0);

  const handleTransferComplete = () => {
    // useAssetBalances();
  };

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
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography
              variant="h4"
              component="div"
              sx={{ fontWeight: 'bold' }}
            >
              ${totalValue.toFixed(2)}
            </Typography>
            <TransferAsset assets={SUPPORTED_TOKENS} onTransferComplete={handleTransferComplete} />
          </Box>
          </CardContent>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Symbol</TableCell>
                    <TableCell>Icon</TableCell>
                    {!isSmallScreen && <TableCell>Address</TableCell>}
                    <TableCell>USD Value</TableCell>
                    <TableCell>Balance</TableCell>
                    <TableCell>Percentage</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {SUPPORTED_TOKENS.map((token) => {
                    const balance = parseFloat(balances[token.symbol] || '0');
                    const price = prices[token.symbol] || 0;
                    const value = balance * price;
                    const percentage = (value / totalValue) * 100;
                    return (
                      <TableRow key={token.symbol}>
                        <TableCell>{token.symbol}</TableCell>
                        <TableCell>
                          <img src={token.icon} alt={token.name} width="24" height="24" />
                        </TableCell>
                        {!isSmallScreen && <TableCell>{token.address}</TableCell>}
                        <TableCell>${price % 1 === 0 ? price.toFixed(2) : price}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            ${usdValues[token.symbol]?.toFixed(2) || '0.00'}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {parseFloat(balances[token.symbol] || '0').toFixed(4)} {token.symbol}
                          </Typography>
                        </TableCell>
                        <TableCell>{percentage.toFixed(2)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}

export default AssetList