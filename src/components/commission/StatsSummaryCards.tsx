import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  CircularProgress
} from '@mui/material';
import { AttachMoney, Pending, CheckCircle } from '@mui/icons-material';
import { CommissionStats } from '../../types/commission';

interface StatsSummaryCardsProps {
  stats: CommissionStats | null;
  loading: boolean;
}

const StatsSummaryCards: React.FC<StatsSummaryCardsProps> = ({
  stats,
  loading
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: 'Total Commissions',
      value: formatCurrency(stats.totalCommissions),
      icon: <AttachMoney sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: 'primary.main'
    },
    {
      title: 'Pending Commissions',
      value: formatCurrency(stats.pendingCommissions),
      icon: <Pending sx={{ fontSize: 40, color: 'warning.main' }} />,
      color: 'warning.main'
    },
    {
      title: 'Paid Commissions',
      value: formatCurrency(stats.paidCommissions),
      icon: <CheckCircle sx={{ fontSize: 40, color: 'success.main' }} />,
      color: 'success.main'
    }
  ];

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      justifyContent="space-between"
    >
      {cards.map((card) => (
        <Card
          key={card.title}
          sx={{
            flex: 1,
            minWidth: { xs: '100%', md: '30%' },
            bgcolor: 'background.paper'
          }}
        >
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              {card.icon}
              <Box>
                <Typography variant="h6" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h4" color={card.color}>
                  {card.value}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default StatsSummaryCards;
