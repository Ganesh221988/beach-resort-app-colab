import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Grid } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import DateRangePicker from '../components/commission/DateRangePicker';
import StatsSummaryCards from '../components/commission/StatsSummaryCards';
import CommissionTrendChart from '../components/commission/CommissionTrendChart';
import CommissionList from '../components/commission/CommissionList';
import useCommissions from '../hooks/useCommissions';

const CommissionsDashboard: React.FC = () => {
  const [startDate, setStartDate] = useState<Date | null>(
    startOfMonth(subMonths(new Date(), 5))
  );
  const [endDate, setEndDate] = useState<Date | null>(endOfMonth(new Date()));
  const [userRole] = useState<'admin' | 'owner' | 'broker'>('admin'); // Replace with actual user role

  const {
    commissions,
    stats,
    loading,
    error,
    fetchCommissions,
    fetchStats
  } = useCommissions({
    role: userRole
  });

  useEffect(() => {
    const params = {
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString()
    };

    fetchCommissions(params);
    fetchStats(params);
  }, [fetchCommissions, fetchStats, startDate, endDate]);

  return (
    <SnackbarProvider maxSnack={3}>
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            Commission Statistics
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
          />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StatsSummaryCards stats={stats} loading={loading} />
            </Grid>

            <Grid item xs={12}>
              {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <CommissionTrendChart
                  commissions={commissions}
                  title="Commission Trends (Last 6 Months)"
                />
              )}
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Recent Commissions
              </Typography>
              {loading ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <CommissionList
                  commissions={commissions.slice(0, 5)}
                  userRole={userRole}
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </SnackbarProvider>
  );
};

export default CommissionsDashboard;
