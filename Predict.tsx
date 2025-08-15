import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Upload as UploadIcon } from '@mui/icons-material';
import axios from 'axios';
import AdvancedAnalysis from './AdvancedAnalysis';

interface PredictionResponse {
  blood_group: string;
  confidence: number;
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
}

const steps = ['Upload DNA Data', 'Analysis', 'Results'];

export const Predict: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
      setActiveStep(1);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<PredictionResponse>(
        'http://localhost:5001/api/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setPrediction(response.data);
      setActiveStep(2);
    } catch (err) {
      setError('Error uploading file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {activeStep === 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Upload DNA Data
            </Typography>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
            >
              Select File
              <input
                type="file"
                hidden
                accept=".csv,.txt"
                onChange={handleFileChange}
              />
            </Button>
            {file && (
              <Typography variant="body2" color="text.secondary">
                Selected file: {file.name}
              </Typography>
            )}
          </Box>
        )}

        {activeStep === 1 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Analyze DNA Data
            </Typography>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Start Analysis'}
            </Button>
          </Box>
        )}

        {activeStep === 2 && prediction && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Prediction Results
            </Typography>
            <Typography variant="h6" color="primary">
              Blood Group: {prediction.blood_group}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Confidence: {prediction.confidence}%
            </Typography>
            
            <AdvancedAnalysis
              analysis={prediction.analysis}
              isLoading={loading}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}; 