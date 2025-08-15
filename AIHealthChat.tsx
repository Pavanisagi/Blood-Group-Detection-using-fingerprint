import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  Send as SendIcon,
  Bloodtype as BloodtypeIcon,
  LocalHospital as HospitalIcon,
  Restaurant as RestaurantIcon,
  FitnessCenter as FitnessIcon,
  Psychology as PsychologyIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBloodGroup } from '../context/BloodGroupContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'health-advice' | 'diet' | 'exercise' | 'general' | 'blood-type' | 'lifestyle';
}

interface LocationState {
  healthScore: number;
  bloodType: string;
}

// API key for the language model service
const API_KEY = 'API_KEY';

const AIHealthChat: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const { bloodGroupData } = useBloodGroup();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);

  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.healthScore) {
      setHealthScore(state.healthScore);
      // Add initial AI message with a more conversational welcome
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: `👋 Hello! I'm your AI Health Assistant. I see your health score is ${state.healthScore}%. I'm here to help you with personalized health advice based on your blood analysis.\n\nWhat would you like to know about today?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'health-advice',
      };
      setMessages([initialMessage]);
    } else if (bloodGroupData?.analysis?.healthScore) {
      // If we have blood group data with health score, use that instead
      setHealthScore(bloodGroupData.analysis.healthScore);
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: `👋 Hello! I'm your AI Health Assistant. I see your health score is ${bloodGroupData.analysis.healthScore}%. I'm here to help you with personalized health advice based on your blood analysis.\n\nWhat would you like to know about today?`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'health-advice',
      };
      setMessages([initialMessage]);
    } else {
      // If no health score is available, redirect back to dashboard
      alert('Please complete your blood analysis first.');
      navigate('/dashboard');
    }
  }, [location.state, navigate, bloodGroupData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Call the external API to get a response
  const callExternalAPI = async (userInput: string, healthScore: number, bloodType: string) => {
    try {
      console.log("Calling ChatGPT API with:", { userInput, healthScore, bloodType });
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `You are a helpful AI health assistant specializing in blood health. The user has a health score of ${healthScore}% and blood type ${bloodType}. Provide personalized health advice based on this information. Be concise, informative, and focus on practical recommendations.`
            },
            {
              role: "user",
              content: userInput
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("API error response:", errorData);
        throw new Error(`API request failed with status ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Invalid response format from API");
      }
      
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling external API:", error);
      return null;
    }
  };

  const generateHealthAdvice = async (userInput: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    let response = '';
    let type: Message['type'] = 'general';

    // Check for health score from either location state or blood group data
    const currentHealthScore = healthScore || bloodGroupData?.analysis?.healthScore;
    
    if (currentHealthScore !== null && currentHealthScore !== undefined) {
      const bloodType = bloodGroupData?.type || 'unknown';
      
      // Try to get a response from the external API first
      const apiResponse = await callExternalAPI(userInput, currentHealthScore, bloodType);
      
      if (apiResponse) {
        // If we got a response from the API, use it
        response = apiResponse;
        
        // Determine the type based on the content
        const lowerInput = userInput.toLowerCase();
        if (lowerInput.includes('diet') || lowerInput.includes('food') || lowerInput.includes('nutrition') || 
            lowerInput.includes('eat') || lowerInput.includes('meal') || lowerInput.includes('dietary') ||
            lowerInput.includes('vitamin') || lowerInput.includes('supplement') || lowerInput.includes('iron')) {
          type = 'diet';
        } else if (lowerInput.includes('exercise') || lowerInput.includes('workout') || lowerInput.includes('activity') || 
                   lowerInput.includes('fitness') || lowerInput.includes('training') || lowerInput.includes('sport') ||
                   lowerInput.includes('cardio') || lowerInput.includes('strength') || lowerInput.includes('yoga')) {
          type = 'exercise';
        } else if (lowerInput.includes('blood type') || lowerInput.includes('blood group') || 
                   lowerInput.includes('blood') || lowerInput.includes('group') || lowerInput.includes('donate') ||
                   lowerInput.includes('donation') || lowerInput.includes('compatible')) {
          type = 'blood-type';
        } else if (lowerInput.includes('lifestyle') || lowerInput.includes('daily routine') || 
                   lowerInput.includes('habit') || lowerInput.includes('routine') || lowerInput.includes('sleep') ||
                   lowerInput.includes('stress') || lowerInput.includes('meditation') || lowerInput.includes('yoga')) {
          type = 'lifestyle';
        } else if (lowerInput.includes('health') || lowerInput.includes('maintain') || 
                   lowerInput.includes('wellness') || lowerInput.includes('well-being') || lowerInput.includes('check-up') ||
                   lowerInput.includes('doctor') || lowerInput.includes('medical') || lowerInput.includes('condition')) {
          type = 'health-advice';
        }
      } else {
        // Fall back to the local response generation if API fails
        const lowerInput = userInput.toLowerCase();
        
        // Check for specific questions about blood donation
        if (lowerInput.includes('donate') || lowerInput.includes('donation')) {
          response = generateDonationAdvice(bloodType);
          type = 'blood-type';
        }
        // Check for specific questions about blood compatibility
        else if (lowerInput.includes('compatible') || lowerInput.includes('compatibility')) {
          response = generateCompatibilityAdvice(bloodType);
          type = 'blood-type';
        }
        // Check for specific questions about blood type characteristics
        else if (lowerInput.includes('characteristic') || lowerInput.includes('traits') || 
                 lowerInput.includes('personality') || lowerInput.includes('type')) {
          response = generateBloodTypeCharacteristics(bloodType);
          type = 'blood-type';
        }
        // Check for diet-related questions
        else if (lowerInput.includes('diet') || lowerInput.includes('food') || lowerInput.includes('nutrition') || 
                 lowerInput.includes('eat') || lowerInput.includes('meal') || lowerInput.includes('dietary') ||
                 lowerInput.includes('vitamin') || lowerInput.includes('supplement') || lowerInput.includes('iron')) {
          response = generateDietAdvice(currentHealthScore);
          type = 'diet';
        } 
        // Check for exercise-related questions
        else if (lowerInput.includes('exercise') || lowerInput.includes('workout') || lowerInput.includes('activity') || 
                 lowerInput.includes('fitness') || lowerInput.includes('training') || lowerInput.includes('sport') ||
                 lowerInput.includes('cardio') || lowerInput.includes('strength') || lowerInput.includes('yoga')) {
          response = generateExerciseAdvice(currentHealthScore);
          type = 'exercise';
        } 
        // Check for blood type-related questions
        else if (lowerInput.includes('blood type') || lowerInput.includes('blood group') || 
                 lowerInput.includes('blood') || lowerInput.includes('group')) {
          response = generateBloodTypeAdvice();
          type = 'blood-type';
        } 
        // Check for lifestyle-related questions
        else if (lowerInput.includes('lifestyle') || lowerInput.includes('daily routine') || 
                 lowerInput.includes('habit') || lowerInput.includes('routine') || lowerInput.includes('sleep') ||
                 lowerInput.includes('stress') || lowerInput.includes('meditation') || lowerInput.includes('yoga')) {
          response = generateLifestyleAdvice(currentHealthScore);
          type = 'lifestyle';
        } 
        // Check for health maintenance-related questions
        else if (lowerInput.includes('health') || lowerInput.includes('maintain') || 
                 lowerInput.includes('wellness') || lowerInput.includes('well-being') || lowerInput.includes('check-up') ||
                 lowerInput.includes('doctor') || lowerInput.includes('medical') || lowerInput.includes('condition')) {
          response = generateHealthMaintenanceAdvice(currentHealthScore);
          type = 'health-advice';
        } 
        // For questions that don't match any category, provide a more helpful response
        else {
          response = `I understand you're asking about "${userInput}". Here's what I can tell you based on your blood health score of ${currentHealthScore}%:\n\n` + 
                    generateGeneralAdvice() + 
                    "\n\nYou can also ask me about:\n" +
                    "• Diet and nutrition\n" +
                    "• Exercise recommendations\n" +
                    "• Blood type specific advice\n" +
                    "• Lifestyle improvements\n" +
                    "• General health tips\n" +
                    "• Blood donation information\n" +
                    "• Blood type compatibility\n" +
                    "• Blood type characteristics";
        }
      }
    } else {
      // If no health score is available
      response = "I don't have your blood analysis data yet. Please complete your blood analysis first to get personalized health advice.";
    }

    setIsLoading(false);
    return { response, type };
  };

  const generateDietAdvice = (score: number) => {
    if (score >= 90) {
      return "Your blood health is excellent! To maintain this:\n\n" +
        "• Continue eating iron-rich foods like lean red meat, spinach, and lentils\n" +
        "• Include vitamin B12 sources like fish, eggs, and dairy\n" +
        "• Stay hydrated with 8-10 glasses of water daily\n" +
        "• Maintain a balanced diet with plenty of fruits and vegetables";
    } else if (score >= 70) {
      return "Your blood health is good, but can be improved. Dietary recommendations:\n\n" +
        "• Increase iron intake with leafy greens and lean meats\n" +
        "• Add vitamin C-rich foods to enhance iron absorption\n" +
        "• Include folate-rich foods like beans and citrus fruits\n" +
        "• Consider iron supplements if recommended by your doctor";
    } else {
      return "Your blood health needs attention. Dietary recommendations:\n\n" +
        "• Focus on iron-rich foods: red meat, spinach, fortified cereals\n" +
        "• Include vitamin B12 sources: fish, eggs, dairy products\n" +
        "• Add vitamin C to meals to improve iron absorption\n" +
        "• Consider consulting a nutritionist for personalized advice";
    }
  };

  const generateExerciseAdvice = (score: number) => {
    if (score >= 90) {
      return "Your blood health supports active exercise. Recommendations:\n\n" +
        "• Continue regular cardio exercises (30-45 minutes daily)\n" +
        "• Include strength training 2-3 times per week\n" +
        "• Stay hydrated during workouts\n" +
        "• Monitor energy levels and adjust intensity as needed";
    } else if (score >= 70) {
      return "Your blood health allows for moderate exercise. Recommendations:\n\n" +
        "• Start with light cardio (20-30 minutes daily)\n" +
        "• Gradually increase intensity\n" +
        "• Include gentle strength training\n" +
        "• Listen to your body and rest when needed";
    } else {
      return "Your blood health requires careful exercise planning. Recommendations:\n\n" +
        "• Begin with light walking (15-20 minutes daily)\n" +
        "• Avoid intense workouts until health improves\n" +
        "• Focus on gentle stretching and mobility\n" +
        "• Consult your doctor before starting any exercise program";
    }
  };

  const generateHealthMaintenanceAdvice = (score: number) => {
    if (score >= 90) {
      return "Your blood health is excellent! Maintenance tips:\n\n" +
        "• Schedule regular blood check-ups\n" +
        "• Maintain a healthy lifestyle\n" +
        "• Get adequate sleep (7-9 hours)\n" +
        "• Manage stress through meditation or yoga";
    } else if (score >= 70) {
      return "Your blood health is good. Maintenance recommendations:\n\n" +
        "• Regular blood tests every 3-6 months\n" +
        "• Monitor iron levels\n" +
        "• Practice stress management\n" +
        "• Maintain a consistent sleep schedule";
    } else {
      return "Your blood health needs attention. Maintenance recommendations:\n\n" +
        "• Schedule frequent blood tests\n" +
        "• Monitor iron and vitamin levels\n" +
        "• Practice stress reduction techniques\n" +
        "• Ensure adequate rest and recovery";
    }
  };

  const generateBloodTypeAdvice = () => {
    const bloodType = bloodGroupData?.type || 'unknown';
    let advice = `Based on your blood type (${bloodType}), here are specific recommendations:\n\n`;

    switch (bloodType) {
      case 'A':
        advice += "• Focus on a plant-based diet with fresh, organic foods\n" +
          "• Include lean proteins like fish and poultry\n" +
          "• Practice stress management through yoga and meditation\n" +
          "• Regular moderate exercise like walking and swimming\n" +
          "• Avoid dairy products and processed foods";
        break;
      case 'B':
        advice += "• Balanced diet including meat, dairy, and vegetables\n" +
          "• Include green vegetables and eggs\n" +
          "• Regular exercise combining cardio and strength training\n" +
          "• Avoid chicken, corn, and wheat\n" +
          "• Practice stress management through tai chi or meditation";
        break;
      case 'AB':
        advice += "• Combination of A and B type recommendations\n" +
          "• Focus on seafood, tofu, and dairy\n" +
          "• Include plenty of vegetables and fruits\n" +
          "• Regular moderate exercise\n" +
          "• Avoid caffeine and alcohol";
        break;
      case 'O':
        advice += "• High-protein diet with lean meats\n" +
          "• Include fish and vegetables\n" +
          "• Regular intense exercise\n" +
          "• Avoid wheat, corn, and dairy\n" +
          "• Practice stress management through physical activity";
        break;
      default:
        advice = "I'll need your blood type information to provide specific recommendations. Would you like to know your blood type first?";
    }

    return advice;
  };

  const generateLifestyleAdvice = (score: number) => {
    if (score >= 90) {
      return "Your lifestyle habits are excellent for maintaining good blood health:\n\n" +
        "• Continue your regular exercise routine\n" +
        "• Maintain a balanced diet with plenty of fruits and vegetables\n" +
        "• Get adequate sleep (7-9 hours per night)\n" +
        "• Practice stress management techniques\n" +
        "• Stay hydrated throughout the day";
    } else if (score >= 70) {
      return "Your lifestyle habits are good but can be improved:\n\n" +
        "• Increase your physical activity to at least 30 minutes daily\n" +
        "• Add more iron-rich foods to your diet\n" +
        "• Ensure you're getting enough sleep\n" +
        "• Practice stress reduction techniques\n" +
        "• Stay hydrated with water throughout the day";
    } else {
      return "Your lifestyle needs significant improvement for better blood health:\n\n" +
        "• Start with light exercise and gradually increase intensity\n" +
        "• Focus on a diet rich in iron, vitamin B12, and folate\n" +
        "• Prioritize sleep and aim for 7-9 hours per night\n" +
        "• Learn and practice stress management techniques\n" +
        "• Increase water intake to at least 8 glasses daily";
    }
  };

  const generateGeneralAdvice = () => {
    return "Based on your blood health score, here are some general recommendations:\n\n" +
      "• Maintain a balanced diet rich in essential nutrients\n" +
      "• Stay hydrated throughout the day\n" +
      "• Get regular exercise appropriate for your health level\n" +
      "• Schedule regular check-ups with your healthcare provider\n" +
      "• Practice stress management techniques";
  };

  // Add new helper functions for more specific advice
  const generateDonationAdvice = (bloodType: string) => {
    let advice = `Based on your blood type (${bloodType}), here's information about blood donation:\n\n`;
    
    switch (bloodType) {
      case 'A':
      case 'A+':
      case 'A-':
        advice += "• Your blood type is in moderate demand\n" +
                 "• You can donate to people with blood types A and AB\n" +
                 "• You can receive blood from people with blood types A and O\n" +
                 "• Consider donating every 3-4 months if eligible\n" +
                 "• Your blood is particularly valuable for plasma donation";
        break;
      case 'B':
      case 'B+':
      case 'B-':
        advice += "• Your blood type is less common\n" +
                 "• You can donate to people with blood types B and AB\n" +
                 "• You can receive blood from people with blood types B and O\n" +
                 "• Consider donating every 3-4 months if eligible\n" +
                 "• Your blood is valuable for patients with sickle cell disease";
        break;
      case 'AB':
      case 'AB+':
      case 'AB-':
        advice += "• Your blood type is rare, especially AB-\n" +
                 "• You can donate to people with blood type AB only\n" +
                 "• You can receive blood from all blood types\n" +
                 "• Consider donating regularly as your blood type is in high demand\n" +
                 "• Your plasma is universal and can be given to patients of any blood type";
        break;
      case 'O':
      case 'O+':
      case 'O-':
        advice += "• Your blood type is the most common\n" +
                 "• You can donate to people with all blood types\n" +
                 "• You can only receive blood from people with blood type O\n" +
                 "• O- is the universal donor and is always in high demand\n" +
                 "• Consider donating regularly, especially if you're O-";
        break;
      default:
        advice = "I'll need your blood type information to provide specific donation advice. Would you like to know your blood type first?";
    }
    
    return advice;
  };

  const generateCompatibilityAdvice = (bloodType: string) => {
    let advice = `Based on your blood type (${bloodType}), here's information about blood compatibility:\n\n`;
    
    switch (bloodType) {
      case 'A+':
        advice += "• You can receive blood from: A+, A-, O+, O-\n" +
                 "• You can donate blood to: A+, AB+\n" +
                 "• Your blood is compatible with about 80% of the population";
        break;
      case 'A-':
        advice += "• You can receive blood from: A-, O-\n" +
                 "• You can donate blood to: A+, A-, AB+, AB-\n" +
                 "• Your blood is compatible with about 40% of the population";
        break;
      case 'B+':
        advice += "• You can receive blood from: B+, B-, O+, O-\n" +
                 "• You can donate blood to: B+, AB+\n" +
                 "• Your blood is compatible with about 70% of the population";
        break;
      case 'B-':
        advice += "• You can receive blood from: B-, O-\n" +
                 "• You can donate blood to: B+, B-, AB+, AB-\n" +
                 "• Your blood is compatible with about 20% of the population";
        break;
      case 'AB+':
        advice += "• You can receive blood from: All blood types\n" +
                 "• You can donate blood to: AB+ only\n" +
                 "• Your blood is compatible with about 5% of the population";
        break;
      case 'AB-':
        advice += "• You can receive blood from: A-, B-, AB-, O-\n" +
                 "• You can donate blood to: AB+, AB-\n" +
                 "• Your blood is compatible with about 2% of the population";
        break;
      case 'O+':
        advice += "• You can receive blood from: O+, O-\n" +
                 "• You can donate blood to: A+, B+, AB+, O+\n" +
                 "• Your blood is compatible with about 85% of the population";
        break;
      case 'O-':
        advice += "• You can receive blood from: O- only\n" +
                 "• You can donate blood to: All blood types\n" +
                 "• Your blood is compatible with about 7% of the population";
        break;
      default:
        advice = "I'll need your blood type information to provide specific compatibility advice. Would you like to know your blood type first?";
    }
    
    return advice;
  };

  const generateBloodTypeCharacteristics = (bloodType: string) => {
    let advice = `Based on your blood type (${bloodType}), here are some characteristics and traits:\n\n`;
    
    switch (bloodType) {
      case 'A':
      case 'A+':
      case 'A-':
        advice += "• You tend to be organized, detail-oriented, and responsible\n" +
                 "• You may have a higher risk of heart disease and certain cancers\n" +
                 "• You may benefit from a plant-based diet with limited meat\n" +
                 "• You may have higher cortisol levels (stress hormone)\n" +
                 "• You may have a more sensitive immune system";
        break;
      case 'B':
      case 'B+':
      case 'B-':
        advice += "• You tend to be adaptable, creative, and flexible\n" +
                 "• You may have a higher risk of autoimmune conditions\n" +
                 "• You may benefit from a balanced diet including meat, dairy, and vegetables\n" +
                 "• You may have a stronger immune system\n" +
                 "• You may be more resistant to stress";
        break;
      case 'AB':
      case 'AB+':
      case 'AB-':
        advice += "• You tend to be rational, calm, and strong\n" +
                 "• You may have a higher risk of heart disease and memory problems\n" +
                 "• You may benefit from a combination of A and B type recommendations\n" +
                 "• You may have a more complex immune system\n" +
                 "• You may be more adaptable to environmental changes";
        break;
      case 'O':
      case 'O+':
      case 'O-':
        advice += "• You tend to be confident, self-determined, and natural leaders\n" +
                 "• You may have a higher risk of ulcers and thyroid problems\n" +
                 "• You may benefit from a high-protein diet with limited grains\n" +
                 "• You may have a stronger immune system\n" +
                 "• You may be more resistant to stress";
        break;
      default:
        advice = "I'll need your blood type information to provide specific characteristics. Would you like to know your blood type first?";
    }
    
    return advice;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickReplies(false);

    try {
      setIsLoading(true);
      const { response, type } = await generateHealthAdvice(input);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response || "I'm sorry, I couldn't generate a response for that question. Please try asking something else about your health, diet, exercise, or blood type.",
        sender: 'ai',
        timestamp: new Date(),
        type,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error while processing your question. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'general',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (question: string) => {
    setInput(question);
    handleSend();
  };

  const getMessageIcon = (type?: Message['type']) => {
    switch (type) {
      case 'health-advice':
        return <HospitalIcon />;
      case 'diet':
        return <RestaurantIcon />;
      case 'exercise':
        return <FitnessIcon />;
      case 'blood-type':
        return <BloodtypeIcon />;
      case 'lifestyle':
        return <PsychologyIcon />;
      default:
        return <BotIcon />;
    }
  };

  const quickReplyOptions = [
    { text: "What should I eat?", type: "diet" },
    { text: "Exercise recommendations", type: "exercise" },
    { text: "Blood type specific advice", type: "blood-type" },
    { text: "Lifestyle improvements", type: "lifestyle" },
    { text: "General health tips", type: "health-advice" },
  ];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <BotIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              AI Health Chatbot
            </Typography>
          </Box>

          <Paper
            elevation={3}
            sx={{
              height: '70vh',
              display: 'flex',
              flexDirection: 'column',
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '80%',
                          display: 'flex',
                          flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main',
                            ml: message.sender === 'user' ? 1 : 0,
                            mr: message.sender === 'user' ? 0 : 1,
                          }}
                        >
                          {message.sender === 'user' ? <PersonIcon /> : getMessageIcon(message.type)}
                        </Avatar>
                        <Box>
                          <Paper
                            elevation={1}
                            sx={{
                              p: 2,
                              background: message.sender === 'user'
                                ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
                                : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                whiteSpace: 'pre-line',
                                color: message.sender === 'user' ? 'primary.main' : 'text.primary',
                              }}
                            >
                              {message.text}
                            </Typography>
                            {message.type && (
                              <Chip
                                label={message.type.charAt(0).toUpperCase() + message.type.slice(1)}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            )}
                          </Paper>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {message.timestamp.toLocaleTimeString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </Box>

            {showQuickReplies && messages.length === 1 && (
              <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                {quickReplyOptions.map((option, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickReply(option.text)}
                    sx={{ 
                      borderRadius: '20px',
                      textTransform: 'none',
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        borderColor: theme.palette.primary.dark,
                      }
                    }}
                  >
                    {option.text}
                  </Button>
                ))}
              </Box>
            )}

            <Divider />

            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask me anything about your health..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                disabled={isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  }
                }}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                sx={{
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: 'white',
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
              </IconButton>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
};

export default AIHealthChat; 