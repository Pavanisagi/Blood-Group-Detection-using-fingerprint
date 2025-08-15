import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Radio,
  RadioGroup,
  FormLabel,
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Bloodtype as BloodtypeIcon,
  LocalHospital as HospitalIcon,
  Description as DescriptionIcon,
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Height as HeightIcon,
  MonitorWeight as WeightIcon,
  Favorite as HeartIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as ThemeIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });
  
  // Initialize with empty values
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
    height: '',
    weight: '',
    bloodType: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  });

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      app: true,
    },
    privacy: {
      profileVisibility: 'public',
      showBloodType: true,
      showHealthRecords: false,
    },
    preferences: {
      language: 'en',
      theme: 'light',
      timezone: 'UTC',
    },
  });

  // Load user data from localStorage on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }
        
        // Load user data from localStorage
        const userName = localStorage.getItem('userName') || 'User';
        const userEmail = localStorage.getItem('userEmail') || '';
        const userPhone = localStorage.getItem('userPhone') || '';
        const userAddress = localStorage.getItem('userAddress') || '';
        const userDOB = localStorage.getItem('userDOB') || '';
        const userGender = localStorage.getItem('userGender') || '';
        const userHeight = localStorage.getItem('userHeight') || '';
        const userWeight = localStorage.getItem('userWeight') || '';
        const userBloodType = localStorage.getItem('userBloodType') || '';
        const userEmergencyContact = localStorage.getItem('userEmergencyContact');
        
        // Set profile data with fallback values
        setProfileData({
          name: userName,
          email: userEmail,
          phone: userPhone,
          address: userAddress,
          dateOfBirth: userDOB,
          gender: userGender,
          height: userHeight,
          weight: userWeight,
          bloodType: userBloodType,
          emergencyContact: userEmergencyContact ? JSON.parse(userEmergencyContact) : {
            name: '',
            phone: '',
            relationship: '',
          },
        });

        // Load settings from localStorage or use defaults
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        } else {
          // Save default settings if none exist
          localStorage.setItem('userSettings', JSON.stringify(settings));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setSnackbar({
          open: true,
          message: 'Error loading user data. Please try again.',
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, navigate, logout]);

  const [healthRecords, setHealthRecords] = useState([
    {
      id: 1,
      date: '2024-03-15',
      type: 'Blood Test',
      hospital: 'City General Hospital',
      description: 'Regular blood work checkup',
      status: 'Completed',
    },
    {
      id: 2,
      date: '2024-02-20',
      type: 'Physical Examination',
      hospital: 'HealthCare Center',
      description: 'Annual physical examination',
      status: 'Completed',
    },
  ]);

  const [donationHistory, setDonationHistory] = useState([
    {
      id: 1,
      date: '2024-01-15',
      location: 'City Blood Bank',
      type: 'Whole Blood',
      status: 'Successful',
    },
    {
      id: 2,
      date: '2023-07-20',
      location: 'Community Blood Drive',
      type: 'Whole Blood',
      status: 'Successful',
    },
  ]);

  const [medicalReports, setMedicalReports] = useState([
    {
      id: 1,
      date: '2024-03-01',
      title: 'Blood Analysis Report',
      type: 'PDF',
      size: '2.5 MB',
    },
    {
      id: 2,
      date: '2024-02-15',
      title: 'Medical History Summary',
      type: 'PDF',
      size: '1.8 MB',
    },
  ]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const validateForm = () => {
    if (!profileData.name.trim()) {
      setSnackbar({
        open: true,
        message: 'Name is required',
        severity: 'error',
      });
      return false;
    }
    if (!profileData.email.trim()) {
      setSnackbar({
        open: true,
        message: 'Email is required',
        severity: 'error',
      });
      return false;
    }
    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error',
      });
      return false;
    }
    return true;
  };

  const handleSave = () => {
    try {
      // Save all profile data to localStorage
      localStorage.setItem('userName', profileData.name);
      localStorage.setItem('userEmail', profileData.email);
      localStorage.setItem('userPhone', profileData.phone);
      localStorage.setItem('userAddress', profileData.address);
      localStorage.setItem('userDOB', profileData.dateOfBirth);
      localStorage.setItem('userGender', profileData.gender);
      localStorage.setItem('userHeight', profileData.height);
      localStorage.setItem('userWeight', profileData.weight);
      localStorage.setItem('userBloodType', profileData.bloodType);
      localStorage.setItem('userEmergencyContact', JSON.stringify(profileData.emergencyContact));
      
      // Save settings
      localStorage.setItem('userSettings', JSON.stringify(settings));
      
      setIsEditing(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      setSnackbar({
        open: true,
        message: 'Error saving profile. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    const userName = localStorage.getItem('userName') || '';
    const userEmail = localStorage.getItem('userEmail') || '';
    const userPhone = localStorage.getItem('userPhone') || '';
    const userAddress = localStorage.getItem('userAddress') || '';
    const userDOB = localStorage.getItem('userDOB') || '';
    const userGender = localStorage.getItem('userGender') || '';
    const userHeight = localStorage.getItem('userHeight') || '';
    const userWeight = localStorage.getItem('userWeight') || '';
    const userBloodType = localStorage.getItem('userBloodType') || '';
    const userEmergencyContact = localStorage.getItem('userEmergencyContact');
    
    setProfileData({
      name: userName,
      email: userEmail,
      phone: userPhone,
      address: userAddress,
      dateOfBirth: userDOB,
      gender: userGender,
      height: userHeight,
      weight: userWeight,
      bloodType: userBloodType,
      emergencyContact: userEmergencyContact ? JSON.parse(userEmergencyContact) : {
        name: '',
        phone: '',
        relationship: '',
      },
    });
    
    setIsEditing(false);
  };

  const handleSettingsChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof settings],
        [setting]: value,
      },
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                : 'linear-gradient(135deg, #f5f5f5 0%, #e0f7fa 100%)',
            }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: theme.palette.primary.main,
                fontSize: '2.5rem',
                mb: 2,
              }}
            >
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom>
              {profileData.name || 'User Profile'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              {profileData.email && (
                <Chip
                  icon={<EmailIcon />}
                  label={profileData.email}
                  variant="outlined"
                />
              )}
              {profileData.phone && (
                <Chip
                  icon={<PhoneIcon />}
                  label={profileData.phone}
                  variant="outlined"
                />
              )}
              {profileData.bloodType && (
                <Chip
                  icon={<BloodtypeIcon />}
                  label={`Blood Type: ${profileData.bloodType}`}
                  variant="outlined"
                  color="error"
                />
              )}
            </Box>
            {profileData.address && (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                {profileData.address}
              </Typography>
            )}
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                startIcon={<EditIcon />}
                disabled={isEditing}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Profile Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Personal Information" />
              <Tab label="Health Information" />
              <Tab label="Health Records" />
              <Tab label="Blood Donation History" />
              <Tab label="Medical Reports" />
              <Tab label="Settings" />
            </Tabs>

            {/* Personal Information Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {isEditing ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      variant="outlined"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : null}
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                    required
                    error={isEditing && !profileData.name.trim()}
                    helperText={isEditing && !profileData.name.trim() ? 'Name is required' : ''}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    required
                    error={isEditing && (!profileData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email))}
                    helperText={isEditing && (!profileData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) ? 'Please enter a valid email' : ''}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={profileData.gender}
                      label="Gender"
                      onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                      <MenuItem value="prefer_not_to_say">Prefer not to say</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!isEditing}
                    multiline
                    rows={2}
                    InputProps={{
                      startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Health Information Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                {isEditing ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      variant="contained"
                      color="primary"
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      variant="outlined"
                      color="error"
                    >
                      Cancel
                    </Button>
                  </Box>
                ) : null}
              </Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height (cm)"
                    value={profileData.height}
                    onChange={(e) => setProfileData({ ...profileData, height: e.target.value })}
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      startAdornment: <HeightIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (kg)"
                    value={profileData.weight}
                    onChange={(e) => setProfileData({ ...profileData, weight: e.target.value })}
                    disabled={!isEditing}
                    type="number"
                    InputProps={{
                      startAdornment: <WeightIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!isEditing}>
                    <InputLabel>Blood Type</InputLabel>
                    <Select
                      value={profileData.bloodType}
                      label="Blood Type"
                      onChange={(e) => setProfileData({ ...profileData, bloodType: e.target.value })}
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
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Emergency Contact
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Name"
                        value={profileData.emergencyContact.name}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          emergencyContact: {
                            ...profileData.emergencyContact,
                            name: e.target.value,
                          },
                        })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={profileData.emergencyContact.phone}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          emergencyContact: {
                            ...profileData.emergencyContact,
                            phone: e.target.value,
                          },
                        })}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Relationship"
                        value={profileData.emergencyContact.relationship}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          emergencyContact: {
                            ...profileData.emergencyContact,
                            relationship: e.target.value,
                          },
                        })}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={5}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Notification Settings
                  </Typography>
                  <Box sx={{ pl: 3 }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.email}
                          onChange={(e) => handleSettingsChange('notifications', 'email', e.target.checked)}
                        />
                      }
                      label="Email Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.sms}
                          onChange={(e) => handleSettingsChange('notifications', 'sms', e.target.checked)}
                        />
                      }
                      label="SMS Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.app}
                          onChange={(e) => handleSettingsChange('notifications', 'app', e.target.checked)}
                        />
                      }
                      label="App Notifications"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    <SecurityIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Privacy Settings
                  </Typography>
                  <Box sx={{ pl: 3 }}>
                    <FormControl component="fieldset" sx={{ width: '100%' }}>
                      <FormLabel component="legend">Profile Visibility</FormLabel>
                      <RadioGroup
                        value={settings.privacy.profileVisibility}
                        onChange={(e) => handleSettingsChange('privacy', 'profileVisibility', e.target.value)}
                      >
                        <FormControlLabel value="public" control={<Radio />} label="Public" />
                        <FormControlLabel value="friends" control={<Radio />} label="Friends Only" />
                        <FormControlLabel value="private" control={<Radio />} label="Private" />
                      </RadioGroup>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.showBloodType}
                          onChange={(e) => handleSettingsChange('privacy', 'showBloodType', e.target.checked)}
                        />
                      }
                      label="Show Blood Type on Profile"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.privacy.showHealthRecords}
                          onChange={(e) => handleSettingsChange('privacy', 'showHealthRecords', e.target.checked)}
                        />
                      }
                      label="Show Health Records"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    <LanguageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Preferences
                  </Typography>
                  <Box sx={{ pl: 3 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Language</InputLabel>
                      <Select
                        value={settings.preferences.language}
                        label="Language"
                        onChange={(e) => handleSettingsChange('preferences', 'language', e.target.value)}
                      >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="de">German</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Theme</InputLabel>
                      <Select
                        value={settings.preferences.theme}
                        label="Theme"
                        onChange={(e) => handleSettingsChange('preferences', 'theme', e.target.value)}
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                        <MenuItem value="system">System Default</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel>Timezone</InputLabel>
                      <Select
                        value={settings.preferences.timezone}
                        label="Timezone"
                        onChange={(e) => handleSettingsChange('preferences', 'timezone', e.target.value)}
                      >
                        <MenuItem value="UTC">UTC</MenuItem>
                        <MenuItem value="EST">Eastern Time</MenuItem>
                        <MenuItem value="CST">Central Time</MenuItem>
                        <MenuItem value="MST">Mountain Time</MenuItem>
                        <MenuItem value="PST">Pacific Time</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Health Records Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                >
                  Add Health Record
                </Button>
              </Box>
              <List>
                {healthRecords.map((record) => (
                  <Card key={record.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body1">
                            {record.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Type
                          </Typography>
                          <Typography variant="body1">
                            {record.type}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Hospital
                          </Typography>
                          <Typography variant="body1">
                            {record.hospital}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Status
                          </Typography>
                          <Chip
                            label={record.status}
                            color="success"
                            size="small"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="body2" color="text.secondary">
                            {record.description}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </TabPanel>

            {/* Blood Donation History Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                >
                  Add Donation Record
                </Button>
              </Box>
              <List>
                {donationHistory.map((donation) => (
                  <Card key={donation.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body1">
                            {donation.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Location
                          </Typography>
                          <Typography variant="body1">
                            {donation.location}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Type
                          </Typography>
                          <Typography variant="body1">
                            {donation.type}
                          </Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Chip
                            icon={<BloodtypeIcon />}
                            label={donation.status}
                            color="success"
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </TabPanel>

            {/* Medical Reports Tab */}
            <TabPanel value={tabValue} index={4}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  color="primary"
                >
                  Upload Report
                </Button>
              </Box>
              <List>
                {medicalReports.map((report) => (
                  <Card key={report.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date
                          </Typography>
                          <Typography variant="body1">
                            {report.date}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Title
                          </Typography>
                          <Typography variant="body1">
                            {report.title}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DescriptionIcon />}
                            >
                              Download
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile; 