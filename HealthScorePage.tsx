import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Alert,
} from '@mui/material';
import HealthScore from './HealthScore';
import { useBloodGroup } from '../context/BloodGroupContext';
import { useNavigate } from 'react-router-dom';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const HealthScorePage: React.FC = () => {
  const { bloodGroupData } = useBloodGroup();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Blood Group Health Score
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Get a comprehensive health analysis based on your blood type
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            {bloodGroupData ? (
              <HealthScore
                bloodType={bloodGroupData.type}
                characteristics={{
                  size: bloodGroupData.size,
                  count: bloodGroupData.count,
                  pattern: bloodGroupData.pattern
                }}
                compatibility={bloodGroupData.compatibility}
              />
            ) : (
              <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <BloodtypeIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  No Blood Group Data Available
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  To view your health score, please first analyze your blood group using the fingerprint analysis feature.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/dna')}
                  startIcon={<BloodtypeIcon />}
                >
                  Go to Blood Group Analysis
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default HealthScorePage; 