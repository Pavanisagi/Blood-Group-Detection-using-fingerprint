import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  useTheme,
  SelectChangeEvent
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Bloodtype as BloodTypeIcon,
  CheckCircle as AvailableIcon,
  Cancel as UnavailableIcon,
} from '@mui/icons-material';

// Define the BloodDonor type
export interface BloodDonor {
  id: string;
  name: string;
  bloodType: string;
  location: string;
  latitude: number;
  longitude: number;
  isAvailable: boolean;
}

// Sample data for testing
const sampleDonors: BloodDonor[] = [
  {
    id: '1',
    name: 'John Doe',
    bloodType: 'A+',
    location: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    bloodType: 'O-',
    location: 'Los Angeles, CA',
    latitude: 34.0522,
    longitude: -118.2437,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Robert Johnson',
    bloodType: 'B+',
    location: 'Chicago, IL',
    latitude: 41.8781,
    longitude: -87.6298,
    isAvailable: false
  },
  {
    id: '4',
    name: 'Emily Davis',
    bloodType: 'AB+',
    location: 'Houston, TX',
    latitude: 29.7604,
    longitude: -95.3698,
    isAvailable: true
  },
  {
    id: '5',
    name: 'Michael Wilson',
    bloodType: 'O+',
    location: 'Phoenix, AZ',
    latitude: 33.4484,
    longitude: -112.0740,
    isAvailable: true
  }
];

const BloodDonorsList: React.FC = () => {
  const theme = useTheme();
  const [donors, setDonors] = useState<BloodDonor[]>(sampleDonors);
  const [filteredDonors, setFilteredDonors] = useState<BloodDonor[]>(sampleDonors);
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodTypeFilter, setBloodTypeFilter] = useState<string>('all');
  const [openModal, setOpenModal] = useState(false);
  const [editingDonor, setEditingDonor] = useState<BloodDonor | null>(null);
  const [newDonor, setNewDonor] = useState<Partial<BloodDonor>>({
    name: '',
    bloodType: '',
    location: '',
    latitude: 0,
    longitude: 0,
    isAvailable: true
  });

  // Filter donors based on search query and blood type filter
  useEffect(() => {
    let filtered = [...donors];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(donor => 
        donor.name.toLowerCase().includes(query) || 
        donor.location.toLowerCase().includes(query) ||
        donor.bloodType.toLowerCase().includes(query)
      );
    }
    
    // Apply blood type filter
    if (bloodTypeFilter !== 'all') {
      filtered = filtered.filter(donor => donor.bloodType === bloodTypeFilter);
    }
    
    setFilteredDonors(filtered);
  }, [donors, searchQuery, bloodTypeFilter]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle blood type filter change
  const handleBloodTypeFilterChange = (event: SelectChangeEvent) => {
    setBloodTypeFilter(event.target.value);
  };

  // Handle opening the add/edit modal
  const handleOpenModal = (donor?: BloodDonor) => {
    if (donor) {
      setEditingDonor(donor);
      setNewDonor({ ...donor });
    } else {
      setEditingDonor(null);
      setNewDonor({
        name: '',
        bloodType: '',
        location: '',
        latitude: 0,
        longitude: 0,
        isAvailable: true
      });
    }
    setOpenModal(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingDonor(null);
    setNewDonor({
      name: '',
      bloodType: '',
      location: '',
      latitude: 0,
      longitude: 0,
      isAvailable: true
    });
  };

  // Handle saving a donor
  const handleSaveDonor = () => {
    if (editingDonor) {
      // Update existing donor
      setDonors(donors.map(donor => 
        donor.id === editingDonor.id ? { ...newDonor, id: donor.id } as BloodDonor : donor
      ));
    } else {
      // Add new donor
      const newId = (Math.max(...donors.map(d => parseInt(d.id))) + 1).toString();
      setDonors([...donors, { ...newDonor, id: newId } as BloodDonor]);
    }
    handleCloseModal();
  };

  // Handle deleting a donor
  const handleDeleteDonor = (id: string) => {
    setDonors(donors.filter(donor => donor.id !== id));
  };

  // Get blood type color
  const getBloodTypeColor = (bloodType: string) => {
    switch (bloodType) {
      case 'A+':
        return theme.palette.error.main;
      case 'A-':
        return theme.palette.error.light;
      case 'B+':
        return theme.palette.warning.main;
      case 'B-':
        return theme.palette.warning.light;
      case 'AB+':
        return theme.palette.info.main;
      case 'AB-':
        return theme.palette.info.light;
      case 'O+':
        return theme.palette.success.main;
      case 'O-':
        return theme.palette.success.light;
      default:
        return theme.palette.grey[500];
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Blood Donors
      </Typography>
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search donors..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Blood Type</InputLabel>
              <Select
                value={bloodTypeFilter}
                onChange={handleBloodTypeFilterChange}
                label="Blood Type"
              >
                <MenuItem value="all">All Blood Types</MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
            >
              Add Donor
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      <Grid container spacing={3}>
        {filteredDonors.map(donor => (
          <Grid item xs={12} sm={6} md={4} key={donor.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{donor.name}</Typography>
                  <Chip
                    label={donor.bloodType}
                    sx={{
                      backgroundColor: getBloodTypeColor(donor.bloodType),
                      color: 'white',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{donor.location}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {donor.isAvailable ? (
                    <AvailableIcon sx={{ mr: 1, color: 'success.main' }} />
                  ) : (
                    <UnavailableIcon sx={{ mr: 1, color: 'error.main' }} />
                  )}
                  <Typography 
                    variant="body2" 
                    color={donor.isAvailable ? 'success.main' : 'error.main'}
                  >
                    {donor.isAvailable ? 'Available' : 'Not Available'}
                  </Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  startIcon={<EditIcon />}
                  onClick={() => handleOpenModal(donor)}
                >
                  Edit
                </Button>
                <Button 
                  size="small" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteDonor(donor.id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Add/Edit Donor Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDonor ? 'Edit Donor' : 'Add New Donor'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Name"
              fullWidth
              value={newDonor.name}
              onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
            />
            <FormControl fullWidth>
              <InputLabel>Blood Type</InputLabel>
              <Select
                value={newDonor.bloodType}
                onChange={(e) => setNewDonor({ ...newDonor, bloodType: e.target.value as string })}
                label="Blood Type"
              >
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Location"
              fullWidth
              value={newDonor.location}
              onChange={(e) => setNewDonor({ ...newDonor, location: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Latitude"
                  type="number"
                  fullWidth
                  value={newDonor.latitude}
                  onChange={(e) => setNewDonor({ ...newDonor, latitude: parseFloat(e.target.value) })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Longitude"
                  type="number"
                  fullWidth
                  value={newDonor.longitude}
                  onChange={(e) => setNewDonor({ ...newDonor, longitude: parseFloat(e.target.value) })}
                />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Availability</InputLabel>
              <Select
                value={newDonor.isAvailable ? 'true' : 'false'}
                onChange={(e) => setNewDonor({ ...newDonor, isAvailable: e.target.value === 'true' })}
                label="Availability"
              >
                <MenuItem value="true">Available</MenuItem>
                <MenuItem value="false">Not Available</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveDonor}
            disabled={!newDonor.name || !newDonor.bloodType || !newDonor.location}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BloodDonorsList; 