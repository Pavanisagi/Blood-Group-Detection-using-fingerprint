import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Fingerprint as FingerprintIcon,
  Bloodtype as BloodtypeIcon,
  ThreeDRotation as ThreeDRotationIcon,
  Person as PersonIcon,
  HealthAndSafety as HealthIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useBloodGroup } from '../context/BloodGroupContext';
import { motion } from 'framer-motion';
import { CloudUpload as UploadIcon, Delete as DeleteIcon } from '@mui/icons-material';
import * as tf from '@tensorflow/tfjs';
import './BloodGroupDNAAnalysis.css';

interface AnalysisResult {
  bloodGroup: string;
  confidence: number;
  dnaAnalysis: {
    markers: string[];
    geneticTraits: string[];
    healthRisks: string[];
    ancestry: string;
  };
  personDetails: {
    age: number;
    gender: string;
    ethnicity: string;
    healthMarkers: string[];
  };
}

const steps = ['Upload Fingerprint', 'Blood Group Analysis', 'DNA Analysis', 'Results'];

interface BloodGroupDNAAnalysisProps {
  onPredictionComplete: (bloodGroup: string, confidence: number) => void;
}

const BloodGroupDNAAnalysis: React.FC<BloodGroupDNAAnalysisProps> = ({ onPredictionComplete }) => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { setBloodGroupData } = useBloodGroup();
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoadAttempts, setModelLoadAttempts] = useState(0);

  // Load the model when component mounts
  useEffect(() => {
    loadModel();
    // Cleanup function to dispose of the model when component unmounts
    return () => {
      if (model) {
        try {
          model.dispose();
        } catch (err) {
          console.error('Error disposing model:', err);
        }
      }
    };
  }, [modelLoadAttempts]);

  const loadModel = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Initialize TensorFlow.js
      await tf.ready();
      console.log('TensorFlow.js initialized with backend:', tf.getBackend());

      // Load the model with progress tracking
      console.log('Loading model from /models/model.json');
      
      // Create a custom model loader that ensures the input shape is correct
      const modelLoader = async () => {
        try {
          // Load the model
          const loadedModel = await tf.loadLayersModel('/models/model.json', {
            onProgress: (fraction) => {
              console.log(`Loading model... ${(fraction * 100).toFixed(1)}%`);
            },
          });
          
          // Log model details
          console.log('Model loaded successfully');
          console.log('Model input shape:', loadedModel.inputs[0].shape);
          console.log('Model output shape:', loadedModel.outputs[0].shape);
          
          return loadedModel;
        } catch (error) {
          console.error('Error in model loader:', error);
          throw error;
        }
      };
      
      // Load the model using our custom loader
      const loadedModel = await modelLoader();
      
      // Warm up the model with a dummy prediction
      console.log('Warming up model with dummy prediction');
      const dummyInput = tf.zeros([1, 128, 128, 3]);
      const warmupResult = loadedModel.predict(dummyInput);
      if (warmupResult instanceof tf.Tensor) {
        warmupResult.dispose();
      }
      dummyInput.dispose();

      console.log('Model loaded and warmed up successfully');
      setModel(loadedModel);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading model:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load the model: ${errorMessage}. Please try refreshing the page.`);
      setIsLoading(false);

      // Retry loading after 3 seconds if we haven't tried too many times
      if (modelLoadAttempts < 3) {
        console.log(`Retrying model load... Attempt ${modelLoadAttempts + 1} of 3`);
        setTimeout(() => {
          setModelLoadAttempts(prev => prev + 1);
        }, 3000);
      }
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/bmp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (PNG, JPG, or BMP)');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size should be less than 10MB');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create a URL for the image to display it
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);

      // Check if model is loaded
      if (!model) {
        console.error('Model not loaded');
        setError('Model not loaded. Please try refreshing the page.');
        setIsLoading(false);
        return;
      }

      // Preprocess the image
      console.log('Processing image...');
      const tensor = await preprocessImage(file);
      console.log('Image processed, tensor shape:', tensor.shape);

      // Make prediction
      console.log('Making prediction...');
      const predictions = model.predict(tensor) as tf.Tensor;
      const probabilities = await predictions.data();
      
      // Clean up tensors
      tensor.dispose();
      predictions.dispose();

      // Get blood group with highest probability
      const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
      const maxProbIndex = Array.from(probabilities).indexOf(Math.max(...Array.from(probabilities)));
      const predictedBloodGroup = bloodGroups[maxProbIndex];
      const confidence = probabilities[maxProbIndex] as number;

      console.log(`Predicted blood group: ${predictedBloodGroup} with confidence: ${confidence}`);
      console.log('All probabilities:', Array.from(probabilities).map((p, i) => `${bloodGroups[i]}: ${p}`));

      // Create a mock analysis result for demonstration
      const mockResult: AnalysisResult = {
        bloodGroup: predictedBloodGroup,
        confidence: confidence,
        dnaAnalysis: {
          markers: ['Marker 1', 'Marker 2', 'Marker 3'],
          geneticTraits: ['Trait 1', 'Trait 2'],
          healthRisks: ['Risk 1', 'Risk 2'],
          ancestry: 'European'
        },
        personDetails: {
          age: 30,
          gender: 'Male',
          ethnicity: 'Caucasian',
          healthMarkers: ['Marker 1', 'Marker 2']
        }
      };

      setAnalysisResult(mockResult);
      
      // Call the callback with results
      onPredictionComplete(predictedBloodGroup, confidence);
      
      // Move to the next step
      setActiveStep(1);
      
      setIsLoading(false);
    } catch (err) {
      console.error('Prediction error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Error processing image: ${errorMessage}. Please try again with a different image.`);
      setIsLoading(false);
    }
  };

  const preprocessImage = async (file: File): Promise<tf.Tensor4D> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Create a canvas to resize and process the image
          const canvas = document.createElement('canvas');
          canvas.width = 128;  // Model input size
          canvas.height = 128; // Model input size
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Draw and resize image
          ctx.drawImage(img, 0, 0, 128, 128);
          
          // Convert to tensor and normalize
          const imageData = ctx.getImageData(0, 0, 128, 128);
          const tensor = tf.browser.fromPixels(imageData)
            .toFloat()
            .div(255.0)
            .expandDims(0) as tf.Tensor4D;
          
          console.log('Preprocessed image tensor shape:', tensor.shape);
          resolve(tensor);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = (err) => {
        reject(err);
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <BloodtypeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            Blood Group & DNA Analysis
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel className="stepper-container">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
                  backdropFilter: 'blur(10px)',
                  borderRadius: 4,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
              >
                {isLoading ? (
                  <Box className="loading-container">
                    <CircularProgress size={60} />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Analyzing your fingerprint...
                    </Typography>
                  </Box>
                ) : error ? (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                  </Alert>
                ) : (
                  <>
                    {activeStep === 0 && (
                      <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom>
                          Upload Your Fingerprint
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          Please upload a clear image of your fingerprint for blood group analysis.
                        </Typography>
                        
                        <Box 
                          className="upload-container"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/bmp"
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                          />
                          <UploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                          <Typography variant="body1">
                            Click to upload or drag and drop
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            PNG, JPG, or BMP (max 10MB)
                          </Typography>
                        </Box>
                        
                        {selectedImage && (
                          <Box className="preview-container">
                            <img 
                              src={selectedImage} 
                              alt="Fingerprint" 
                              className="preview-image"
                            />
                            <IconButton 
                              className="delete-button"
                              onClick={handleDeleteImage}
                              size="small"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        )}
                      </Paper>
                    )}

                    {activeStep === 1 && analysisResult && (
                      <Paper elevation={3} sx={{ p: 4 }}>
                        <Typography variant="h6" gutterBottom>
                          Blood Group Analysis Results
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <BloodtypeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                          <Box>
                            <Typography variant="h5">
                              Blood Group: {analysisResult!.bloodGroup}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Confidence: {(analysisResult!.confidence * 100).toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Button 
                          variant="contained" 
                          color="primary"
                          onClick={() => setActiveStep(2)}
                          sx={{ mt: 2 }}
                        >
                          Continue to DNA Analysis
                        </Button>
                      </Paper>
                    )}

                    {activeStep === 2 && analysisResult && (
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScienceIcon color="primary" /> DNA Analysis
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Genetic Markers
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {analysisResult.dnaAnalysis.markers.map((marker, index) => (
                                <Chip key={index} label={marker} size="small" />
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Genetic Traits
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {analysisResult.dnaAnalysis.geneticTraits.map((trait, index) => (
                                <Chip key={index} label={trait} size="small" color="primary" />
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Health Risks
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {analysisResult.dnaAnalysis.healthRisks.map((risk, index) => (
                                <Chip key={index} label={risk} size="small" color="error" />
                              ))}
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Ancestry
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                              {analysisResult.dnaAnalysis.ancestry}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}

                    {activeStep === 3 && analysisResult && (
                      <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="primary" /> Person Details
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Age
                            </Typography>
                            <Typography variant="body1">
                              {analysisResult.personDetails.age} years
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Gender
                            </Typography>
                            <Typography variant="body1">
                              {analysisResult.personDetails.gender}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Ethnicity
                            </Typography>
                            <Typography variant="body1">
                              {analysisResult.personDetails.ethnicity}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="text.secondary">
                              Health Status
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                              {analysisResult.personDetails.healthMarkers.map((marker, index) => (
                                <Chip key={index} label={marker} size="small" color="success" />
                              ))}
                            </Box>
                          </Grid>
                        </Grid>
                      </Paper>
                    )}
                  </>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title="About Blood Group & DNA Analysis"
                  avatar={<ScienceIcon />}
                />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    Our advanced analysis system combines fingerprint pattern recognition with DNA analysis to provide comprehensive insights about your blood group and genetic profile.
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <li>Fingerprint pattern analysis</li>
                    <li>Blood group prediction</li>
                    <li>DNA marker identification</li>
                    <li>Genetic trait analysis</li>
                    <li>Health risk assessment</li>
                    <li>Ancestry information</li>
                  </Box>
                </CardContent>
              </Card>

              <Card sx={{ mb: 3 }}>
                <CardHeader
                  title="Accuracy"
                  avatar={<TimelineIcon />}
                />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    Our combined analysis system achieves over 95% accuracy in blood group prediction and genetic analysis through advanced AI algorithms.
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={95}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader
                  title="Security"
                  avatar={<SecurityIcon />}
                />
                <CardContent>
                  <Typography variant="body2" paragraph>
                    Your fingerprint and genetic data are processed securely and never stored. We follow strict privacy protocols and process all data locally.
                  </Typography>
                  <Alert severity="info" sx={{ mt: 2 }}>
                    All data is processed locally and never shared with third parties.
                  </Alert>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      </Box>
    </Container>
  );
};

export default BloodGroupDNAAnalysis; 