import React, { useState } from 'react';
import { Box, Button, Card, CardContent, TextField, CircularProgress, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { format } from 'date-fns';

function ArtMetrics() {
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!fromDate || !toDate || fromDate > toDate) {
      return;
    }

    setLoading(true);
    const formattedFromDate = format(fromDate, 'yyyy-MM-dd');
    const formattedToDate = format(toDate, 'yyyy-MM-dd');

    try {
      setTimeout(async () => {
        const response = await axios.get('/api/adminART/artMetrics', {
          params: { fromDate: formattedFromDate, toDate: formattedToDate }
        });
        processChartData(response.data);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to fetch art metrics:', error);
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFromDate(null);
    setToDate(null);
    setChartData([]);
  };

  const processChartData = (data) => {
    const aggregatedData = data.reduce((acc, item) => {
      const empKey = `Employee ${item.emp_id}`;
      if (!acc[empKey]) {
        acc[empKey] = {
          emp_id: empKey,
          total: 0,
          breakdown: {}
        };
      }
      acc[empKey].total += parseInt(item.count, 10);
      acc[empKey].breakdown[`ART ${item.art_id}`] = parseInt(item.count, 10);

      return acc;
    }, {});

    const formattedData = Object.values(aggregatedData).map(item => ({
      emp_id: item.emp_id,
      total: item.total,
      ...item.breakdown
    }));

    setChartData(formattedData);
  };

  return (
    <Card sx={{ m: 2, p: 2, pl: 4, width: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>ART Metrics</Typography>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="From Date"
              value={fromDate}
              onChange={setFromDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="To Date"
              value={toDate}
              onChange={(setToDate)}
              minDate={fromDate}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            onClick={fetchData}
            disabled={!fromDate || !toDate || fromDate > toDate}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            onClick={resetFilters}
            disabled={!fromDate && !toDate && chartData.length === 0}
          >
            Reset
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emp_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Total" />
                {Object.keys(chartData[0]).filter(key => key.includes('ART')).map((artKey, index) => (
                  <Bar key={index} dataKey={artKey} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} name={artKey} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              No data available for the selected dates or please select dates first and click Filter.
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ArtMetrics;