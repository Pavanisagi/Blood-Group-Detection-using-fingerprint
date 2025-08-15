import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import ScienceIcon from '@mui/icons-material/Science';
import SecurityIcon from '@mui/icons-material/Security';
import TimelineIcon from '@mui/icons-material/Timeline';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import InfoIcon from '@mui/icons-material/Info';

interface BloodGroupDetailsProps {
  bloodType: string;
  description: string;
  characteristics: {
    size: number;
    count: number;
    pattern: string;
  };
  compatibility: {
    canReceiveFrom: string[];
    canDonateTo: string[];
  };
}

const BloodGroupDetails: React.FC<BloodGroupDetailsProps> = ({
  bloodType,
  description,
  characteristics,
  compatibility,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BloodtypeIcon color="primary" />
          Blood Type {bloodType}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {description}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ScienceIcon color="primary" />
          Characteristics
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Cell Size
              </Typography>
              <Typography variant="h6">
                {(characteristics.size * 100).toFixed(0)}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Cell Count
              </Typography>
              <Typography variant="h6">
                {characteristics.count}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">
                Pattern
              </Typography>
              <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                {characteristics.pattern}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CompareArrowsIcon color="primary" />
          Compatibility
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Can Receive From:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {compatibility.canReceiveFrom.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  color="success"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Can Donate To:
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {compatibility.canDonateTo.map((type) => (
                <Chip
                  key={type}
                  label={type}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InfoIcon color="primary" />
          Additional Information
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <TimelineIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Distribution"
              secondary={`Blood type ${bloodType} is one of the most common blood types worldwide.`}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <SecurityIcon color="primary" />
            </ListItemIcon>
            <ListItemText
              primary="Safety"
              secondary="This blood type is safe for transfusion when proper compatibility is confirmed."
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default BloodGroupDetails; 