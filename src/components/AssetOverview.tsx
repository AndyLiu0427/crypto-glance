import React from 'react';
import { useAssetBalances } from '../hooks/useAssetBalances';
import { SUPPORTED_TOKENS } from '../constants/tokens';
import { Box, Card, CardContent, Grid, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import { pieArcLabelClasses, PieChart } from '@mui/x-charts/PieChart';

const COLORS = ['#77B1A9', '#F4C7AB', '#FF6B6B', '#FFA07A', '#9B7EDE', '#FDB45C', '#76D7C4', '#F7CAC9', '#FFCCBC', '#87CEEB'];


const AssetOverview: React.FC = () => {
  const { balances, prices } = useAssetBalances();

  const pieData = SUPPORTED_TOKENS.map((token, index) => {
    const balance = parseFloat(balances[token.symbol] || '0');
    const price = prices[token.symbol] || 0;
    const value = balance * price;
    return {
      id: index,
      label: token.symbol,
      value: value,
    };
  }).filter(item => item.value > 0);

  return (
    <Box>
      <Card
        variant="outlined"
        sx={{ minHeight: { xs: 'auto', md: 450 }, maxHeight: 'max-content' }}
      >
        <CardContent>
          <Typography variant="h5" component="div">
            Asset Overview
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Asset Distribution
          </Typography>
        </CardContent>
        <CardContent>
          <PieChart
            colors={COLORS}
            series={[
              {
                data: pieData,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
            ]}
            height={300}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssetOverview;