import React from 'react';
import { TextField, Select, MenuItem, FormControl, InputLabel, Slider, Button, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  priceRange: [number, number];
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  propertyType: string;
  amenities: string[];
  location: string;
}

const AdvancedSearchFilter: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [filters, setFilters] = React.useState<SearchFilters>({
    priceRange: [0, 5000],
    checkIn: null,
    checkOut: null,
    guests: 1,
    propertyType: '',
    amenities: [],
    location: ''
  });

  const amenitiesList = [
    'Swimming Pool',
    'Gym',
    'WiFi',
    'Parking',
    'Restaurant',
    'Beach Access',
    'Spa',
    'Room Service'
  ];

  const propertyTypes = [
    'Resort',
    'Villa',
    'Apartment',
    'Cottage',
    'Beach House'
  ];

  const handleSearch = () => {
    onSearch(filters);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Location</InputLabel>
            <TextField
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              placeholder="Enter location"
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Property Type</InputLabel>
            <Select
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value as string })}
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Check-in Date"
            value={filters.checkIn}
            onChange={(date) => setFilters({ ...filters, checkIn: date })}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <DatePicker
            label="Check-out Date"
            value={filters.checkOut}
            onChange={(date) => setFilters({ ...filters, checkOut: date })}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Price Range</InputLabel>
            <Slider
              value={filters.priceRange}
              onChange={(_, newValue) => setFilters({ ...filters, priceRange: newValue as [number, number] })}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Amenities</InputLabel>
            <Select
              multiple
              value={filters.amenities}
              onChange={(e) => setFilters({ ...filters, amenities: e.target.value as string[] })}
            >
              {amenitiesList.map((amenity) => (
                <MenuItem key={amenity} value={amenity}>
                  {amenity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default AdvancedSearchFilter;
