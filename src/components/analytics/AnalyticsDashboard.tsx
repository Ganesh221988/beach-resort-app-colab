import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import api from '../../services/api';

interface AnalyticsData {
  financial: any;
  occupancy: any;
  forecast: any;
}

const AnalyticsDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [selectedProperty, setSelectedProperty] = useState<string>('all');

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, selectedProperty]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [financialData, occupancyData, forecastData] = await Promise.all([
        api.get('/analytics/financial', {
          params: {
            startDate: dateRange.startDate.toISOString(),
            endDate: dateRange.endDate.toISOString(),
            propertyId: selectedProperty !== 'all' ? selectedProperty : undefined
          }
        }),
        api.get('/analytics/occupancy', {
          params: {
            startDate: dateRange.startDate.toISOString(),
            endDate: dateRange.endDate.toISOString(),
            propertyId: selectedProperty !== 'all' ? selectedProperty : undefined
          }
        }),
        api.get('/analytics/forecast', {
          params: {
            propertyId: selectedProperty !== 'all' ? selectedProperty : undefined
          }
        })
      ]);

      setData({
        financial: financialData.data,
        occupancy: occupancyData.data,
        forecast: forecastData.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Property</InputLabel>
              <Select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
              >
                <MenuItem value="all">All Properties</MenuItem>
                {/* Add property options dynamically */}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={(date) => date && setDateRange({ ...dateRange, startDate: date })}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={(date) => date && setDateRange({ ...dateRange, endDate: date })}
            />
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={3}>
        {/* Financial Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Financial Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.financial?.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Occupancy Rates */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Occupancy Rates
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.occupancy?.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="propertyName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="occupancyRate" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenue Forecast */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Forecast
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.forecast?.data?.forecast}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="predictedRevenue" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnalyticsDashboard;
