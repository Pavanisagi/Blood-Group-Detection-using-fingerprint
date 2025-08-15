import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Rating,
  Snackbar,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Send as SendIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface FeedbackData {
  name: string;
  email: string;
  rating: number | null;
  message: string;
}

const Feedback: React.FC = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState<FeedbackData>({
    name: '',
    email: '',
    rating: null,
    message: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (_: React.ChangeEvent<{}>, value: number | null) => {
    setFormData({ ...formData, rating: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the feedback to your backend
    console.log('Feedback submitted:', formData);
    setSnackbar({
      open: true,
      message: 'Thank you for your feedback!',
      severity: 'success',
    });
    // Reset form
    setFormData({
      name: '',
      email: '',
      rating: null,
      message: '',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <FeedbackIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
            <Typography variant="h4" component="h1">
              Feedback
            </Typography>
          </Box>

          <Paper
            elevation={3}
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 4,
              background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`,
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Typography variant="h6" gutterBottom>
              We value your feedback
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please share your experience with our blood group prediction service. Your feedback helps us improve.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
              />

              <Box>
                <Typography component="legend">Rate your experience</Typography>
                <Rating
                  name="rating"
                  value={formData.rating}
                  onChange={handleRatingChange}
                  size="large"
                  sx={{ mt: 1 }}
                />
              </Box>

              <TextField
                label="Your Message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                multiline
                rows={4}
                fullWidth
                required
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<SendIcon />}
                sx={{
                  mt: 2,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  },
                }}
              >
                Submit Feedback
              </Button>
            </Box>
          </Paper>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </motion.div>
      </Box>
    </Container>
  );
};

export default Feedback; 