import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AdvancedAnalysis from '../components/AdvancedAnalysis';
import ThreeDimensionalView from '../components/ThreeDimensionalView';
import HealthMetrics from '../components/HealthMetrics';
import BloodCompatibility from '../components/BloodCompatibility';
import DonationTracker from '../components/DonationTracker';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Advanced Analysis',
      description: 'Upload your fingerprint for blood group prediction',
      component: <AdvancedAnalysis />,
      path: '/analysis'
    },
    {
      title: '3D Visualization',
      description: 'Interactive 3D view of fingerprint patterns',
      component: <ThreeDimensionalView data={{ points: [], lines: [] }} />,
      path: '/visualization'
    },
    {
      title: 'Health Metrics',
      description: 'Track your health indicators',
      component: <HealthMetrics 
        stressLevel={0}
        healthScore={0}
        riskFactors={[]}
      />,
      path: '/health'
    },
    {
      title: 'Blood Compatibility',
      description: 'Check blood group compatibility',
      component: <BloodCompatibility bloodType="A+" />,
      path: '/compatibility'
    },
    {
      title: 'Donation Tracker',
      description: 'Track your blood donations',
      component: <DonationTracker donations={[]} />,
      path: '/donations'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Blood Group Prediction System
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Advanced fingerprint analysis for blood group prediction
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    onClick={() => navigate(feature.path)}
                  >
                    Access {feature.title}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Home; 