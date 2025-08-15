import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tooltip,
} from '@mui/material';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

interface HealthScoreProps {
  bloodType: string;
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

interface HealthFactor {
  name: string;
  score: number;
  description: string;
  icon: React.ReactNode;
}

const HealthScore: React.FC<HealthScoreProps> = ({
  bloodType,
  characteristics,
  compatibility,
}) => {
  // Calculate health factors
  const calculateHealthFactors = (): HealthFactor[] => {
    const factors: HealthFactor[] = [];

    // Blood Cell Health
    const cellHealthScore = Math.min(100, (characteristics.size * 100) + (characteristics.count * 5));
    factors.push({
      name: 'Blood Cell Health',
      score: cellHealthScore,
      description: `Based on cell size (${(characteristics.size * 100).toFixed(0)}%) and count (${characteristics.count})`,
      icon: <BloodtypeIcon color="primary" />,
    });

    // Compatibility Score
    const compatibilityScore = (compatibility.canReceiveFrom.length / 8) * 100;
    factors.push({
      name: 'Blood Compatibility',
      score: compatibilityScore,
      description: `Can receive from ${compatibility.canReceiveFrom.length} blood types`,
      icon: <FavoriteIcon color="primary" />,
    });

    // Donation Potential
    const donationScore = (compatibility.canDonateTo.length / 8) * 100;
    factors.push({
      name: 'Donation Potential',
      score: donationScore,
      description: `Can donate to ${compatibility.canDonateTo.length} blood types`,
      icon: <LocalHospitalIcon color="primary" />,
    });

    // Overall Health Score
    const overallScore = factors.reduce((acc, factor) => acc + factor.score, 0) / factors.length;
    factors.push({
      name: 'Overall Health Score',
      score: overallScore,
      description: 'Combined assessment of all health factors',
      icon: <HealthAndSafetyIcon color="primary" />,
    });

    return factors;
  };

  const healthFactors = calculateHealthFactors();
  const overallScore = healthFactors.find(f => f.name === 'Overall Health Score')?.score || 0;

  const getHealthStatus = (score: number) => {
    if (score >= 80) return { color: 'success', label: 'Excellent' };
    if (score >= 60) return { color: 'info', label: 'Good' };
    if (score >= 40) return { color: 'warning', label: 'Fair' };
    return { color: 'error', label: 'Poor' };
  };

  const healthStatus = getHealthStatus(overallScore);

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <HealthAndSafetyIcon color="primary" sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h5" gutterBottom>
            Health Score Analysis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Blood Type: {bloodType}
          </Typography>
        </Box>
      </Box>

      {/* Overall Score */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6">Overall Health Score</Typography>
          <Chip
            label={`${overallScore.toFixed(0)}%`}
            color={healthStatus.color as any}
            icon={healthStatus.color === 'success' ? <CheckCircleIcon /> : <WarningIcon />}
          />
        </Box>
        <LinearProgress
          variant="determinate"
          value={overallScore}
          color={healthStatus.color as any}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Box>

      {/* Health Factors */}
      <Grid container spacing={3}>
        {healthFactors.map((factor) => (
          <Grid item xs={12} md={6} key={factor.name}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {factor.icon}
                <Typography variant="h6" sx={{ ml: 1 }}>
                  {factor.name}
                </Typography>
                <Tooltip title={factor.description}>
                  <InfoIcon fontSize="small" color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  Score: {factor.score.toFixed(0)}%
                </Typography>
                <Chip
                  label={getHealthStatus(factor.score).label}
                  color={getHealthStatus(factor.score).color as any}
                  size="small"
                />
              </Box>
              <LinearProgress
                variant="determinate"
                value={factor.score}
                color={getHealthStatus(factor.score).color as any}
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Health Recommendations */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Health Recommendations
        </Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Regular Blood Donation"
              secondary="Consider donating blood regularly to maintain healthy blood cell production"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Iron-Rich Diet"
              secondary="Maintain a diet rich in iron to support healthy blood cell production"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleIcon color="success" />
            </ListItemIcon>
            <ListItemText
              primary="Regular Check-ups"
              secondary="Schedule regular blood tests to monitor your blood health"
            />
          </ListItem>
        </List>
      </Box>
    </Paper>
  );
};

export default HealthScore; 