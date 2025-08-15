import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  HealthAndSafety,
  Science,
  Warning,
  LocalHospital,
} from '@mui/icons-material';

interface AdvancedAnalysisProps {
  analysis: {
    dna_analysis: {
      genetic_markers: number[];
      confidence: number;
    };
    health_analysis: {
      stress_level: number;
      health_score: number;
      risk_factors: number[];
    };
    compatible_groups: string[];
    medical_info: {
      allergies: string[];
      common_conditions: string[];
    };
  };
  isLoading: boolean;
}

const AdvancedAnalysis: React.FC<AdvancedAnalysisProps> = ({ analysis, isLoading }) => {
  if (isLoading) {
    return (
      <Box sx={{ mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Science sx={{ mr: 1 }} />
              Genetic Markers
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {analysis.dna_analysis.genetic_markers.map((marker, index) => (
                <Chip
                  key={index}
                  label={`Marker ${index + 1}: ${marker}`}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <HealthAndSafety sx={{ mr: 1 }} />
              Health Score
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ flexGrow: 1, mr: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={analysis.health_analysis.health_score}
                  color={analysis.health_analysis.health_score > 70 ? "success" : "warning"}
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {analysis.health_analysis.health_score}%
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <Warning sx={{ mr: 1 }} />
              Risk Factors
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {analysis.health_analysis.risk_factors.map((risk, index) => (
                <Chip
                  key={index}
                  label={`Risk ${index + 1}: ${risk}`}
                  color="error"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              <LocalHospital sx={{ mr: 1 }} />
              Medical Information
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Allergies:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysis.medical_info.allergies.map((allergy, index) => (
                  <Chip
                    key={index}
                    label={allergy}
                    color="warning"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Common Conditions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {analysis.medical_info.common_conditions.map((condition, index) => (
                  <Tooltip key={index} title={`Common condition related to blood group`}>
                    <Chip
                      label={condition}
                      color="info"
                      variant="outlined"
                    />
                  </Tooltip>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdvancedAnalysis; 