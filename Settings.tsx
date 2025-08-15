import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
  Accessibility as AccessibilityIcon,
  Info as InfoIcon,
  Save as SaveIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  // Language settings
  const [language, setLanguage] = useState('en');
  
  // Theme settings
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState('medium');
  
  // Accessibility settings
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1500);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Customize your application settings, including notifications, language, theme, and accessibility options.
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errorMessage}
          </Alert>
        )}

        <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<NotificationsIcon />} label="Notifications" />
            <Tab icon={<LanguageIcon />} label="Language" />
            <Tab icon={<PaletteIcon />} label="Theme" />
            <Tab icon={<AccessibilityIcon />} label="Accessibility" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose how you want to receive notifications about your health and blood donation activities.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                <Tooltip title="Receive notifications via email">
                  <InfoIcon color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Push Notifications"
                />
                <Tooltip title="Receive push notifications in the browser">
                  <InfoIcon color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                />
                <Tooltip title="Receive notifications via SMS">
                  <InfoIcon color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Language Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Choose your preferred language for the application interface.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="language-select-label">Language</InputLabel>
                  <Select
                    labelId="language-select-label"
                    value={language}
                    label="Language"
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="es">Español</MenuItem>
                    <MenuItem value="fr">Français</MenuItem>
                    <MenuItem value="de">Deutsch</MenuItem>
                    <MenuItem value="zh">中文</MenuItem>
                    <MenuItem value="ja">日本語</MenuItem>
                    <MenuItem value="ko">한국어</MenuItem>
                    <MenuItem value="hi">हिंदी</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Theme Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Customize the appearance of the application.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="theme-select-label">Theme</InputLabel>
                  <Select
                    labelId="theme-select-label"
                    value={theme}
                    label="Theme"
                    onChange={(e) => setTheme(e.target.value)}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                    <MenuItem value="system">System Default</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="font-size-select-label">Font Size</InputLabel>
                  <Select
                    labelId="font-size-select-label"
                    value={fontSize}
                    label="Font Size"
                    onChange={(e) => setFontSize(e.target.value)}
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                    <MenuItem value="x-large">Extra Large</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Accessibility Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Customize the application to make it more accessible for your needs.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={highContrast}
                      onChange={(e) => setHighContrast(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="High Contrast Mode"
                />
                <Tooltip title="Increase contrast for better visibility">
                  <InfoIcon color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={reducedMotion}
                      onChange={(e) => setReducedMotion(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Reduced Motion"
                />
                <Tooltip title="Reduce animations and motion effects">
                  <InfoIcon color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={screenReader}
                      onChange={(e) => setScreenReader(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Screen Reader Optimization"
                />
                <Tooltip title="Optimize for screen readers">
                  <InfoIcon color="action" sx={{ ml: 1 }} />
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveSettings}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Settings; 