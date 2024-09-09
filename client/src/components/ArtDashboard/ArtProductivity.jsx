import React, { useState, useEffect } from 'react';
import { Card, CardContent, TextField, MenuItem, Button, Box, Typography, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function ArtProductivity() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [employees, setEmployees] = useState([]);
  const [productivityData, setProductivityData] = useState([]);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/adminART/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const fetchData = async () => {
    if (!selectedEmployee || !selectedDate) {
      return;
    }
    setLoading(true);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    try {
      setTimeout(async () => {
        const response = await axios.get('/api/adminART/productivity', {
          params: { date: formattedDate, emp_id: selectedEmployee }
        });
        const formattedData = response.data.map((item, index) => ({
          name: item.art_id,
          value: convertIntervalToMinutes(item.time_spent),
          color: COLORS[index % COLORS.length]
        }));
        const totalTime = formattedData.reduce((acc, curr) => acc + curr.value, 0);
        setTotalTime(totalTime);
        setProductivityData(formattedData);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to fetch productivity data:', error);
      setLoading(false);
    }
  };

  const convertIntervalToMinutes = (timeSpent) => {
    const hours = timeSpent.hours || 0;
    const minutes = timeSpent.minutes || 0;
    const seconds = timeSpent.seconds || 0;
    return hours * 60 + minutes + Math.round(seconds / 60);
  };

  const resetFilters = () => {
    setSelectedDate(null);
    setSelectedEmployee('');
    setProductivityData([]);
    setTotalTime(0);
  };

  return (
    <Card sx={{ m: 2, p: 2, pl: 4, width: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 2 }}>Employee ART Productivity Chart</Typography>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TextField
              select
              label="Select Employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              fullWidth
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </MenuItem>
              ))}
            </TextField>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              renderInput={(params) => <TextField {...params} />}
              maxDate={new Date()}
            />
          </LocalizationProvider>
          <Button variant="contained" onClick={fetchData} disabled={!selectedEmployee || !selectedDate}>
            Filter
          </Button>
          <Button variant="outlined" onClick={resetFilters}>
            Reset
          </Button>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ mt: 2  }}>*Time shown in minutes*</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Total Productivity: {totalTime} minutes</Typography>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
              <CircularProgress />
            </Box>
          ) : productivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={productivityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {productivityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              No data available for the selected date or please select date first and click Filter.
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

export default ArtProductivity;