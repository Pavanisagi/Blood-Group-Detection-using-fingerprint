import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

interface BloodCompatibilityProps {
  bloodType: string;
}

const BloodCompatibility: React.FC<BloodCompatibilityProps> = ({ bloodType }) => {
  const getCompatibleTypes = (type: string) => {
    const compatibility: { [key: string]: string[] } = {
      'A+': ['A+', 'AB+'],
      'A-': ['A+', 'A-', 'AB+', 'AB-'],
      'B+': ['B+', 'AB+'],
      'B-': ['B+', 'B-', 'AB+', 'AB-'],
      'AB+': ['AB+'],
      'AB-': ['AB+', 'AB-'],
      'O+': ['A+', 'B+', 'AB+', 'O+'],
      'O-': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    };
    return compatibility[type] || [];
  };

  const canReceiveFrom = (type: string) => {
    const receivers: { [key: string]: string[] } = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'],
    };
    return receivers[type] || [];
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Blood Type Compatibility
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Your Blood Type: {bloodType}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Can Donate To:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {getCompatibleTypes(bloodType).map((type) => (
                <li key={type}>{type}</li>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Can Receive From:
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              {canReceiveFrom(bloodType).map((type) => (
                <li key={type}>{type}</li>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BloodCompatibility; 