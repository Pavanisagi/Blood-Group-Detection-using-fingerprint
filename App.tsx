import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Container } from '@mui/material';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BloodGroupProvider } from './context/BloodGroupContext';
import MenuButton from './components/MenuButton';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import { Predict } from './components/Predict';
import AIHealthChat from './components/AIHealthChat';
import AIDashboard from './components/AIDashboard';
import AIBloodGroupPredictor from './components/AIBloodGroupPredictor';
import BloodGroupDNAAnalysis from './components/BloodGroupDNAAnalysis';
import HealthScorePage from './components/HealthScorePage';
import BloodDonorsList from './components/BloodDonorsList';
import Feedback from './components/Feedback';
import Security from './components/Security';
import VisualizationContainer from './components/VisualizationContainer';
import ThreeDimensionalView from './components/ThreeDimensionalView';
import BloodGroupVisualization from './components/BloodGroupVisualization';

function AppContent() {
  const { themeMode } = useThemeContext();

  const handlePredictionComplete = (bloodGroup: string, confidence: number) => {
    console.log(`Prediction complete: Blood Group ${bloodGroup} with ${confidence}% confidence`);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: themeMode === 'dark' 
          ? 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)'
          : 'linear-gradient(135deg, #f5f5f5 0%, #e0f7fa 100%)',
      }}
    >
      <CssBaseline />
      <MenuButton />
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          pt: { xs: 9, sm: 10 }, 
          pb: 6,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/predict" element={<Predict />} />
            <Route path="/chat" element={<AIHealthChat />} />
            <Route path="/ai-dashboard" element={<AIDashboard />} />
            <Route path="/ai-predictor" element={<AIBloodGroupPredictor />} />
            <Route path="/dna-analysis" element={<BloodGroupDNAAnalysis onPredictionComplete={handlePredictionComplete} />} />
            <Route path="/health-score" element={<HealthScorePage />} />
            <Route path="/blood-donors" element={<BloodDonorsList />} />
            <Route path="/visualization" element={<BloodGroupVisualization />} />
            <Route path="/3d-view" element={
              <ThreeDimensionalView 
                data={{
                  points: Array.from({ length: 1000 }, () => [
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5,
                    Math.random() * 10 - 5
                  ])
                }}
              />
            } />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/security" element={<Security />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BloodGroupProvider>
            <AppContent />
          </BloodGroupProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App; 