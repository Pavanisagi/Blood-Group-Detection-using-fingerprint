import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Grid, Button, Switch, FormControlLabel, Divider, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Chip, LinearProgress, Container, Stack } from '@mui/material';
import VisualizationContainer from './VisualizationContainer';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ScienceIcon from '@mui/icons-material/Science';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorageIcon from '@mui/icons-material/Storage';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BiotechIcon from '@mui/icons-material/Biotech';
import CoronavirusIcon from '@mui/icons-material/Coronavirus';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';

interface BloodGroupInfo {
  type: string;
  color: string;
  size: number;
  count: number;
  pattern: string;
  description: string;
  compatibility: {
    canReceiveFrom: string[];
    canDonateTo: string[];
  };
  characteristics: {
    antigenPresence: string[];
    antibodyPresence: string[];
    healthRisks: string[];
    rhFactor: string;
  };
  statistics: {
    globalPercentage: number;
    donationFrequency: string;
    storageLife: number;
  };
}

const bloodGroups: BloodGroupInfo[] = [
  {
    type: 'A+',
    color: '#ff0000',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group A positive with Rh factor',
    compatibility: {
      canReceiveFrom: ['A+', 'A-', 'O+', 'O-'],
      canDonateTo: ['A+', 'AB+']
    },
    characteristics: {
      antigenPresence: ['A'],
      antibodyPresence: ['B'],
      healthRisks: ['Heart Disease', 'Stomach Cancer'],
      rhFactor: 'positive'
    },
    statistics: {
      globalPercentage: 30,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  },
  {
    type: 'A-',
    color: '#ff4444',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group A negative with Rh factor',
    compatibility: {
      canReceiveFrom: ['A-', 'O-'],
      canDonateTo: ['A+', 'A-', 'AB+', 'AB-']
    },
    characteristics: {
      antigenPresence: ['A'],
      antibodyPresence: ['B'],
      healthRisks: ['Heart Disease', 'Stomach Cancer'],
      rhFactor: 'negative'
    },
    statistics: {
      globalPercentage: 6,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  },
  {
    type: 'B+',
    color: '#0000ff',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group B positive with Rh factor',
    compatibility: {
      canReceiveFrom: ['B+', 'B-', 'O+', 'O-'],
      canDonateTo: ['B+', 'AB+']
    },
    characteristics: {
      antigenPresence: ['B'],
      antibodyPresence: ['A'],
      healthRisks: ['Pancreatic Cancer'],
      rhFactor: 'positive'
    },
    statistics: {
      globalPercentage: 9,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  },
  {
    type: 'B-',
    color: '#4444ff',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group B negative with Rh factor',
    compatibility: {
      canReceiveFrom: ['B-', 'O-'],
      canDonateTo: ['B+', 'B-', 'AB+', 'AB-']
    },
    characteristics: {
      antigenPresence: ['B'],
      antibodyPresence: ['A'],
      healthRisks: ['Pancreatic Cancer'],
      rhFactor: 'negative'
    },
    statistics: {
      globalPercentage: 2,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  },
  {
    type: 'AB+',
    color: '#800080',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group AB positive with Rh factor',
    compatibility: {
      canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      canDonateTo: ['AB+']
    },
    characteristics: {
      antigenPresence: ['A', 'B'],
      antibodyPresence: [],
      healthRisks: ['Heart Disease', 'Cognitive Impairment'],
      rhFactor: 'positive'
    },
    statistics: {
      globalPercentage: 4,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  },
  {
    type: 'AB-',
    color: '#9932CC',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group AB negative with Rh factor',
    compatibility: {
      canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'],
      canDonateTo: ['AB+', 'AB-']
    },
    characteristics: {
      antigenPresence: ['A', 'B'],
      antibodyPresence: [],
      healthRisks: ['Heart Disease', 'Cognitive Impairment'],
      rhFactor: 'negative'
    },
    statistics: {
      globalPercentage: 1,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  },
  {
    type: 'O+',
    color: '#00ff00',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group O positive with Rh factor',
    compatibility: {
      canReceiveFrom: ['O+', 'O-'],
      canDonateTo: ['A+', 'B+', 'AB+', 'O+']
    },
    characteristics: {
      antigenPresence: [],
      antibodyPresence: ['A', 'B'],
      healthRisks: ['Peptic Ulcers', 'Thyroid Disorders'],
      rhFactor: 'positive'
    },
    statistics: {
      globalPercentage: 37,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  },
  {
    type: 'O-',
    color: '#32CD32',
    size: 1,
    count: 100,
    pattern: 'circular',
    description: 'Blood group O negative with Rh factor',
    compatibility: {
      canReceiveFrom: ['O-'],
      canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    },
    characteristics: {
      antigenPresence: [],
      antibodyPresence: ['A', 'B'],
      healthRisks: ['Peptic Ulcers', 'Thyroid Disorders'],
      rhFactor: 'negative'
    },
    statistics: {
      globalPercentage: 7,
      donationFrequency: 'Every 56 days',
      storageLife: 42
    }
  }
];

// Characteristics Container Component
const CharacteristicsContainer: React.FC<{ bloodGroup: BloodGroupInfo }> = ({ bloodGroup }) => {
  return (
    <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <BiotechIcon sx={{ mr: 1 }} /> Blood Type Characteristics
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BloodtypeIcon sx={{ mr: 1 }} /> Blood Type: {bloodGroup.type}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {bloodGroup.description}
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ScienceIcon sx={{ mr: 1 }} /> Antigen & Antibody Profile
          </Typography>
          <Divider sx={{ mb: 1 }} />
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Antigens Present" 
                secondary={bloodGroup.characteristics.antigenPresence.join(', ') || 'None'} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="secondary" />
              </ListItemIcon>
              <ListItemText 
                primary="Antibodies Present" 
                secondary={bloodGroup.characteristics.antibodyPresence.join(', ') || 'None'} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <BloodtypeIcon color="error" />
              </ListItemIcon>
              <ListItemText 
                primary="Rh Factor" 
                secondary={bloodGroup.characteristics.rhFactor} 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <HealthAndSafetyIcon sx={{ mr: 1 }} /> Health Risks
          </Typography>
          <Divider sx={{ mb: 1 }} />
          
          <List dense>
            {bloodGroup.characteristics.healthRisks.map((risk, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ErrorIcon color="error" />
                </ListItemIcon>
                <ListItemText primary={risk} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Paper>
  );
};

// Statistics Container Component
const StatisticsContainer: React.FC<{ bloodGroup: BloodGroupInfo }> = ({ bloodGroup }) => {
  return (
    <Paper sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <BarChartIcon sx={{ mr: 1 }} /> Blood Type Statistics
      </Typography>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon sx={{ mr: 1 }} /> Global Distribution
          </Typography>
          <Divider sx={{ mb: 1 }} />
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 100 }}>
              {bloodGroup.statistics.globalPercentage}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={bloodGroup.statistics.globalPercentage} 
              sx={{ flexGrow: 1, height: 10, borderRadius: 5 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            of the world population
          </Typography>
        </CardContent>
      </Card>
      
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AccessTimeIcon sx={{ mr: 1 }} /> Donation Information
          </Typography>
          <Divider sx={{ mb: 1 }} />
          
          <List dense>
            <ListItem>
              <ListItemIcon>
                <AccessTimeIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Donation Frequency" 
                secondary={bloodGroup.statistics.donationFrequency} 
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <StorageIcon color="secondary" />
              </ListItemIcon>
              <ListItemText 
                primary="Storage Life" 
                secondary={`${bloodGroup.statistics.storageLife} days`} 
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CompareArrowsIcon sx={{ mr: 1 }} /> Compatibility
          </Typography>
          <Divider sx={{ mb: 1 }} />
          
          <Typography variant="body2" gutterBottom>
            Can receive from:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
            {bloodGroup.compatibility.canReceiveFrom.map((type) => (
              <Chip key={type} label={type} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
          
          <Typography variant="body2" gutterBottom>
            Can donate to:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {bloodGroup.compatibility.canDonateTo.map((type) => (
              <Chip key={type} label={type} size="small" color="secondary" variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
};

const BloodGroupVisualization: React.FC = () => {
  const [selectedBloodType, setSelectedBloodType] = useState<string>('A+');
  const [compareBloodType, setCompareBloodType] = useState<string>('');
  const [showHealthMetrics, setShowHealthMetrics] = useState<boolean>(false);
  const [showCompatibility, setShowCompatibility] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [showCharacteristics, setShowCharacteristics] = useState<boolean>(true);

  const handleBloodTypeChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedBloodType(newValue);
  };

  const handleCompareBloodTypeChange = (event: React.SyntheticEvent, newValue: string) => {
    setCompareBloodType(newValue);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const selectedBloodGroup = bloodGroups.find(bg => bg.type === selectedBloodType);
  const compareBloodGroup = bloodGroups.find(bg => bg.type === compareBloodType);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Blood Group Visualization
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '600px' }}>
            <VisualizationContainer
              title="3D Blood Cell Visualization"
              subtitle={`Blood Type: ${selectedBloodType}`}
              bloodType={selectedBloodType}
              compareBloodType={compareBloodType}
              bloodGroups={bloodGroups}
              showHealthMetrics={showHealthMetrics}
              showCompatibility={showCompatibility}
            />
          </Paper>
          
          {/* Characteristics Container below the 3D visualization */}
          {showCharacteristics && selectedBloodGroup && (
            <Paper sx={{ p: 2, mt: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Blood Type Information
                </Typography>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="standard"
                  sx={{ minHeight: 'auto' }}
                >
                  <Tab label="Characteristics" />
                  <Tab label="Statistics" />
                </Tabs>
              </Box>
              
              {activeTab === 0 && (
                <CharacteristicsContainer bloodGroup={selectedBloodGroup} />
              )}

              {activeTab === 1 && (
                <StatisticsContainer bloodGroup={selectedBloodGroup} />
              )}
            </Paper>
          )}
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Blood Type Selection
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={showCharacteristics}
                    onChange={(e) => setShowCharacteristics(e.target.checked)}
                  />
                }
                label="Show Characteristics"
              />
            </Box>
            
            <Tabs
              value={selectedBloodType}
              onChange={handleBloodTypeChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              {bloodGroups.map((bg) => (
                <Tab key={bg.type} label={bg.type} value={bg.type} />
              ))}
            </Tabs>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Compare With
            </Typography>
            <Tabs
              value={compareBloodType}
              onChange={handleCompareBloodTypeChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ mb: 2 }}
            >
              <Tab label="None" value="" />
              {bloodGroups.map((bg) => (
                <Tab key={bg.type} label={bg.type} value={bg.type} />
              ))}
            </Tabs>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showHealthMetrics}
                    onChange={(e) => setShowHealthMetrics(e.target.checked)}
                  />
                }
                label="Show Health Metrics"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showCompatibility}
                    onChange={(e) => setShowCompatibility(e.target.checked)}
                  />
                }
                label="Show Compatibility"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BloodGroupVisualization; 