import React from 'react';
import { useAssetBalances } from '../hooks/useAssetBalances';
import { SUPPORTED_TOKENS } from '../constants/tokens';
import { Typography } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AssetOverview: React.FC = () => {
  const { balances, prices } = useAssetBalances();

  const pieData = SUPPORTED_TOKENS.map((token) => {
    const balance = parseFloat(balances[token.symbol] || '0');
    const price = prices[token.symbol] || 0;
    const value = balance * price;
    return {
      name: token.symbol,
      value: value,
    };
  });

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Asset Overview
      </Typography>
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
        Asset Distribution
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetOverview;