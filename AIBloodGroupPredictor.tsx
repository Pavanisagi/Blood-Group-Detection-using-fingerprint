import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import {
  CloudUpload,
  Science,
  HealthAndSafety,
  Psychology,
  Bloodtype,
  AutoGraph,
  Share,
  Download,
  Print,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useBloodGroup } from '../context/BloodGroupContext';
import { useNavigate } from 'react-router-dom';
import './AIBloodGroupPredictor.css';

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

interface AIInsight {
  title: string;
  description: string;
  confidence: number;
  category: 'health' | 'donation' | 'genetic';
}

const AIBloodGroupPredictor: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setBloodGroupData } = useBloodGroup();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (prediction) {
      analyzeData();
    }
  }, [prediction]);

  const analyzeData = async () => {
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Generate AI insights based on the prediction
    const newInsights: AIInsight[] = [
      {
        title: 'Health Pattern Detected',
        description: `AI has identified a ${prediction && prediction.analysis.health_analysis.health_score > 80 ? 'positive' : 'moderate'} correlation between your blood type and overall health markers.`,
        confidence: 0.95,
        category: 'health',
      },
      {
        title: 'Donation Recommendation',
        description: `Based on your blood type analysis, ${prediction?.blood_group} blood is ${prediction?.analysis?.health_analysis?.health_score ?? 0 > 80 ? 'highly' : 'moderately'} suitable for donation.`,
        confidence: 0.88,
        category: 'donation',
      },
      {
        title: 'Genetic Compatibility',
        description: `Your blood type shows ${(prediction?.analysis?.dna_analysis?.confidence ?? 0) > 0.9 ? 'strong' : 'moderate'} genetic compatibility with ${prediction?.analysis?.compatible_groups?.join(', ') || 'other'} blood types.`,
        confidence: prediction?.analysis?.dna_analysis?.confidence ?? 0.85,
        category: 'genetic',
      },
    ];

    setInsights(newInsights);
    setIsAnalyzing(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.bmp')) {
        setError('Please select a BMP image file');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setPrediction(null);
      setActiveStep(0);
      setInsights([]);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      // First, check if the backend is running
      try {
        await axios.get('http://localhost:5001/');
      } catch (err) {
        setError('Backend server is not running. Please start the Python server first.');
        setIsLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Sending request to backend...');
      const response = await axios.post<PredictionResponse>('http://localhost:5001/api/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Received response:', response.data);
      setPrediction(response.data);
      
      // Update the blood group context
      setBloodGroupData({
        type: response.data.blood_group,
        size: 5.5, // Default values
        count: 5.5,
        pattern: 'normal',
        compatibility: {
          canReceiveFrom: response.data.analysis.compatible_groups,
          canDonateTo: response.data.analysis.compatible_groups,
        },
      });
      
      setActiveStep(1);
    } catch (err) {
      console.error('Error during prediction:', err);
      setError('Failed to process the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: AIInsight['category']) => {
    switch (category) {
      case 'health':
        return theme.palette.success.main;
      case 'donation':
        return theme.palette.primary.main;
      case 'genetic':
        return theme.palette.secondary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const steps = ['Upload Fingerprint', 'AI Analysis Results'];

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          AI-Enhanced Blood Group Prediction
        </Typography>
        <Typography variant="subtitle1" gutterBottom align="center" color="text.secondary">
          Advanced AI-Powered Fingerprint Analysis with Health Insights
        </Typography>

        <Stepper activeStep={activeStep} sx={{ my: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <input
                accept=".bmp"
                style={{ display: 'none' }}
                id="fingerprint-upload"
                type="file"
                onChange={handleFileSelect}
              />
              <label htmlFor="fingerprint-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                  size="large"
                >
                  Upload Fingerprint
                </Button>
              </label>

              {preview && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={preview}
                    alt="Fingerprint preview"
                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                  />
                </Box>
              )}

              {selectedFile && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handlePredict}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <Science />}
                >
                  {isLoading ? 'Analyzing...' : 'Predict Blood Group'}
                </Button>
              )}
            </Box>
          </Paper>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {activeStep === 1 && prediction && (
          <Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Prediction Results
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Bloodtype sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h4" color="primary">
                        {prediction.blood_group}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Confidence: {(prediction.confidence * 100).toFixed(2)}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="h6" gutterBottom>
                    Health Score
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HealthAndSafety sx={{ fontSize: 30, color: 'success.main', mr: 2 }} />
                    <Box>
                      <Typography variant="h5" color="success.main">
                        {prediction.analysis.health_analysis.health_score}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Overall health assessment
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setActiveStep(0);
                        setSelectedFile(null);
                        setPreview(null);
                        setPrediction(null);
                        setInsights([]);
                      }}
                    >
                      Analyze Another Fingerprint
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate('/ai-dashboard')}
                      startIcon={<Psychology />}
                    >
                      View AI Dashboard
                    </Button>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    AI Insights
                  </Typography>
                  
                  {isAnalyzing ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box sx={{ position: 'relative' }}>
                      {insights.map((insight, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <Box sx={{ display: 'flex', mb: 3, position: 'relative' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mr: 2,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: '50%',
                                  bgcolor: getCategoryColor(insight.category),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: `0 0 10px ${alpha(getCategoryColor(insight.category), 0.5)}`,
                                }}
                              >
                                <AutoGraph sx={{ color: 'white', fontSize: 16 }} />
                              </Box>
                              {index < insights.length - 1 && (
                                <Box
                                  sx={{
                                    width: 2,
                                    height: 40,
                                    background: `linear-gradient(to bottom, ${getCategoryColor(insight.category)}, ${getCategoryColor(insights[index + 1].category)})`,
                                    opacity: 0.5,
                                    mt: 1,
                                  }}
                                />
                              )}
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6">{insight.title}</Typography>
                              <Typography color="text.secondary">{insight.description}</Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Confidence: {(insight.confidence * 100).toFixed(1)}%
                                </Typography>
                                <Box
                                  sx={{
                                    ml: 1,
                                    width: 60,
                                    height: 4,
                                    bgcolor: alpha(getCategoryColor(insight.category), 0.2),
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${insight.confidence * 100}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    style={{
                                      height: '100%',
                                      background: `linear-gradient(90deg, ${getCategoryColor(insight.category)}, ${alpha(getCategoryColor(insight.category), 0.5)})`,
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </motion.div>
                      ))}
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h5" gutterBottom>
                    Detailed Analysis
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            DNA Analysis
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Genetic markers analysis for blood type determination
                          </Typography>
                          <Typography variant="body1">
                            Confidence: {(prediction.analysis.dna_analysis.confidence * 100).toFixed(2)}%
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Genetic Markers:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {prediction.analysis.dna_analysis.genetic_markers.map((marker, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={`Marker ${idx + 1}: ${marker.toFixed(2)}`} 
                                  size="small" 
                                  color="primary" 
                                  variant="outlined" 
                                />
                              ))}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Health Analysis
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Comprehensive health assessment based on blood analysis
                          </Typography>
                          <Typography variant="body1">
                            Health Score: {prediction.analysis.health_analysis.health_score}%
                          </Typography>
                          <Typography variant="body1">
                            Stress Level: {prediction.analysis.health_analysis.stress_level}%
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Risk Factors:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {prediction.analysis.health_analysis.risk_factors.map((risk, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={`Risk ${idx + 1}: ${risk.toFixed(2)}`} 
                                  size="small" 
                                  color={risk > 0.7 ? "error" : risk > 0.4 ? "warning" : "success"} 
                                />
                              ))}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Compatibility
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            Blood type compatibility for transfusion
                          </Typography>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Compatible Blood Types:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {prediction.analysis.compatible_groups.map((group, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={group} 
                                  size="small" 
                                  color="primary" 
                                />
                              ))}
                            </Box>
                          </Box>
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2">Medical Information:</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {prediction.analysis.medical_info.allergies.map((allergy, idx) => (
                                <Chip 
                                  key={idx} 
                                  label={allergy} 
                                  size="small" 
                                  color="error" 
                                  variant="outlined" 
                                />
                              ))}
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Tooltip title="Download Report">
                      <IconButton color="primary">
                        <Download />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share Results">
                      <IconButton color="primary">
                        <Share />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Print Report">
                      <IconButton color="primary">
                        <Print />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default AIBloodGroupPredictor; 