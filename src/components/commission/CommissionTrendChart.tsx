import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { Commission } from '../../types/commission';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

interface CommissionTrendChartProps {
  commissions: Commission[];
  title?: string;
}

interface ChartData {
  name: string;
  totalAmount: number;
  pendingAmount: number;
  paidAmount: number;
  commissionCount: number;
}

const CommissionTrendChart: React.FC<CommissionTrendChartProps> = ({
  commissions,
  title = 'Commission Trends'
}) => {
  const theme = useTheme();

  const prepareChartData = (): ChartData[] => {
    if (!commissions.length) return [];

    // Get date range
    const dates = commissions.map(c => new Date(c.createdAt));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));

    // Generate all months in range
    const months = eachMonthOfInterval({
      start: startOfMonth(minDate),
      end: endOfMonth(maxDate)
    });

    // Prepare data for each month
    return months.map(month => {
      const monthCommissions = commissions.filter(
        c =>
          new Date(c.createdAt) >= startOfMonth(month) &&
          new Date(c.createdAt) <= endOfMonth(month)
      );

      const pendingAmount = monthCommissions
        .filter(c => c.status === 'PENDING')
        .reduce((sum, c) => sum + c.amount, 0);

      const paidAmount = monthCommissions
        .filter(c => c.status === 'PAID')
        .reduce((sum, c) => sum + c.amount, 0);

      return {
        name: format(month, 'MMM yyyy'),
        totalAmount: pendingAmount + paidAmount,
        pendingAmount,
        paidAmount,
        commissionCount: monthCommissions.length
      };
    });
  };

  const data = prepareChartData();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Paper sx={{ p: 3, height: 400 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: 350 }}>
        <ResponsiveContainer>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tick={{ fill: theme.palette.text.primary }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: theme.palette.text.primary }}
              tickFormatter={formatCurrency}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: theme.palette.text.primary }}
            />
            <Tooltip
              formatter={(value: number, name: string) => {
                if (
                  name === 'totalAmount' ||
                  name === 'pendingAmount' ||
                  name === 'paidAmount'
                ) {
                  return [formatCurrency(value), name];
                }
                return [value, name];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="pendingAmount"
              name="Pending Amount"
              fill={theme.palette.warning.main}
              stackId="amount"
            />
            <Bar
              yAxisId="left"
              dataKey="paidAmount"
              name="Paid Amount"
              fill={theme.palette.success.main}
              stackId="amount"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="commissionCount"
              name="Number of Commissions"
              stroke={theme.palette.primary.main}
              strokeWidth={2}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CommissionTrendChart;
