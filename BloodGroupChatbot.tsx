import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Container,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const BloodGroupChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello! I\'m your blood group information assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        text: generateBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const generateBotResponse = (userInput: string): string => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('blood type') || lowerInput.includes('blood group')) {
      return 'Blood types are classified into four main groups: A, B, AB, and O. Each type can be either positive or negative based on the presence of the Rh factor.';
    }
    
    if (lowerInput.includes('donor') || lowerInput.includes('donate')) {
      return 'Blood donation is a safe process that can save lives. Type O negative is the universal donor, while AB positive is the universal recipient.';
    }
    
    if (lowerInput.includes('compatibility')) {
      return 'Blood type compatibility is crucial for safe transfusions. For example, type A can receive from A and O, while type B can receive from B and O.';
    }
    
    if (lowerInput.includes('rh factor')) {
      return 'The Rh factor is a protein found on the surface of red blood cells. If you have it, you\'re Rh positive; if you don\'t, you\'re Rh negative.';
    }
    
    return 'I can help you with information about blood types, donation, compatibility, and the Rh factor. What would you like to know?';
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Blood Group Information Assistant
        </Typography>
        <Paper
          elevation={3}
          sx={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              overflow: 'auto',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <List>
              {messages.map((message, index) => (
                <React.Fragment key={index}>
                  <ListItem
                    sx={{
                      flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                      gap: 1,
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: message.sender === 'user' ? 'primary.main' : 'secondary.main' }}>
                        {message.sender === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={message.text}
                      sx={{
                        '& .MuiListItemText-primary': {
                          bgcolor: message.sender === 'user' ? 'primary.light' : 'grey.100',
                          color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                          p: 1,
                          borderRadius: 2,
                          maxWidth: '80%',
                        },
                      }}
                    />
                  </ListItem>
                  {index < messages.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <div ref={messagesEndRef} />
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <IconButton
                color="primary"
                onClick={handleSend}
                disabled={!input.trim()}
                sx={{ bgcolor: 'primary.main', color: 'white' }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default BloodGroupChatbot; 