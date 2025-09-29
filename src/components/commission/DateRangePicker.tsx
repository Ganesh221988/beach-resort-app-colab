import React from 'react';
import { Box, Paper } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          display="flex"
          gap={2}
          flexDirection={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={onStartDateChange}
            maxDate={endDate || undefined}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small'
              }
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={onEndDateChange}
            minDate={startDate || undefined}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small'
              }
            }}
          />
        </Box>
      </Paper>
    </LocalizationProvider>
  );
};

export default DateRangePicker;
