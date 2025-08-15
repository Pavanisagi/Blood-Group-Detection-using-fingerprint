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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Lock as LockIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Fingerprint as FingerprintIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
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
      id={`security-tabpanel-${index}`}
      aria-labelledby={`security-tab-${index}`}
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

interface SecurityLog {
  id: string;
  action: string;
  timestamp: Date;
  device: string;
  location: string;
  status: 'success' | 'warning' | 'error';
}

const Security: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailVerificationEnabled, setEmailVerificationEnabled] = useState(true);
  const [phoneVerificationEnabled, setPhoneVerificationEnabled] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'2fa' | 'password' | 'email' | 'phone'>('2fa');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Sample security logs
  const securityLogs: SecurityLog[] = [
    {
      id: '1',
      action: 'Login',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      device: 'Chrome on MacBook Pro',
      location: 'San Francisco, CA',
      status: 'success',
    },
    {
      id: '2',
      action: 'Password Changed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      device: 'Safari on iPhone',
      location: 'San Francisco, CA',
      status: 'success',
    },
    {
      id: '3',
      action: 'Failed Login Attempt',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      device: 'Unknown',
      location: 'Unknown',
      status: 'warning',
    },
    {
      id: '4',
      action: 'Two-Factor Authentication Enabled',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      device: 'Chrome on MacBook Pro',
      location: 'San Francisco, CA',
      status: 'success',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    if (!twoFactorEnabled) {
      setDialogType('2fa');
      setOpenDialog(true);
    }
  };

  const handleToggleEmailVerification = () => {
    setEmailVerificationEnabled(!emailVerificationEnabled);
    if (!emailVerificationEnabled) {
      setDialogType('email');
      setOpenDialog(true);
    }
  };

  const handleTogglePhoneVerification = () => {
    setPhoneVerificationEnabled(!phoneVerificationEnabled);
    if (!phoneVerificationEnabled) {
      setDialogType('phone');
      setOpenDialog(true);
    }
  };

  const handleChangePassword = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1500);
  };

  const handleVerifyCode = () => {
    setIsLoading(true);
    setErrorMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOpenDialog(false);
      setSuccessMessage('Verification successful!');
      setTimeout(() => setSuccessMessage(''), 5000);
    }, 1500);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setVerificationCode('');
  };

  const getStatusIcon = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getStatusChip = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success':
        return <Chip label="Success" color="success" size="small" />;
      case 'warning':
        return <Chip label="Warning" color="warning" size="small" />;
      case 'error':
        return <Chip label="Error" color="error" size="small" />;
      default:
        return <Chip label="Info" color="info" size="small" />;
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Security Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Manage your account security settings, including password, two-factor authentication, and security logs.
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
            <Tab icon={<LockIcon />} label="Password" />
            <Tab icon={<FingerprintIcon />} label="Two-Factor Auth" />
            <Tab icon={<EmailIcon />} label="Email Verification" />
            <Tab icon={<PhoneIcon />} label="Phone Verification" />
            <Tab icon={<HistoryIcon />} label="Security Logs" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="h6" gutterBottom>
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              It's a good idea to use a strong password that you don't use elsewhere.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password"
                  type={showNewPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  startIcon={isLoading ? <CircularProgress size={20} /> : <LockIcon />}
                >
                  {isLoading ? 'Changing Password...' : 'Change Password'}
                </Button>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Typography variant="h6" gutterBottom>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Two-factor authentication adds an extra layer of security to your account by requiring a verification code in addition to your password.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFactorEnabled}
                    onChange={handleToggleTwoFactor}
                    color="primary"
                  />
                }
                label="Enable Two-Factor Authentication"
              />
              <Tooltip title="Two-factor authentication adds an extra layer of security to your account">
                <InfoIcon color="action" sx={{ ml: 1 }} />
              </Tooltip>
            </Box>
            
            {twoFactorEnabled && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Two-factor authentication is enabled. Your account is more secure.
              </Alert>
            )}
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FingerprintIcon />}
              onClick={() => {
                setDialogType('2fa');
                setOpenDialog(true);
              }}
            >
              Manage Two-Factor Authentication
            </Button>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Email Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Email verification helps ensure that only you can access your account.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={emailVerificationEnabled}
                    onChange={handleToggleEmailVerification}
                    color="primary"
                  />
                }
                label="Enable Email Verification"
              />
              <Tooltip title="Email verification adds an extra layer of security to your account">
                <InfoIcon color="action" sx={{ ml: 1 }} />
              </Tooltip>
            </Box>
            
            {emailVerificationEnabled && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Email verification is enabled. Your account is more secure.
              </Alert>
            )}
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<EmailIcon />}
              onClick={() => {
                setDialogType('email');
                setOpenDialog(true);
              }}
            >
              Manage Email Verification
            </Button>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Phone Verification
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Phone verification adds an additional layer of security to your account.
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={phoneVerificationEnabled}
                    onChange={handleTogglePhoneVerification}
                    color="primary"
                  />
                }
                label="Enable Phone Verification"
              />
              <Tooltip title="Phone verification adds an extra layer of security to your account">
                <InfoIcon color="action" sx={{ ml: 1 }} />
              </Tooltip>
            </Box>
            
            {phoneVerificationEnabled && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Phone verification is enabled. Your account is more secure.
              </Alert>
            )}
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PhoneIcon />}
              onClick={() => {
                setDialogType('phone');
                setOpenDialog(true);
              }}
            >
              Manage Phone Verification
            </Button>
          </TabPanel>

          <TabPanel value={tabValue} index={4}>
            <Typography variant="h6" gutterBottom>
              Security Logs
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              View your recent security activity, including logins, password changes, and security settings updates.
            </Typography>
            
            <List>
              {securityLogs.map((log) => (
                <React.Fragment key={log.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      {getStatusIcon(log.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={log.action}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {log.timestamp.toLocaleString()}
                          </Typography>
                          <br />
                          <Typography component="span" variant="body2">
                            {log.device} • {log.location}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    {getStatusChip(log.status)}
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<HistoryIcon />}
              sx={{ mt: 2 }}
            >
              View All Security Logs
            </Button>
          </TabPanel>
        </Paper>
      </motion.div>

      {/* Verification Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {dialogType === '2fa' && 'Two-Factor Authentication'}
          {dialogType === 'password' && 'Change Password'}
          {dialogType === 'email' && 'Email Verification'}
          {dialogType === 'phone' && 'Phone Verification'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {dialogType === '2fa' && (
            <>
              <Typography variant="body1" paragraph>
                To enable two-factor authentication, you'll need to set up an authenticator app like Google Authenticator or Authy.
              </Typography>
              <Typography variant="body1" paragraph>
                Scan the QR code below with your authenticator app, or enter the code manually.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <Paper elevation={3} sx={{ p: 2, width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    QR Code Placeholder
                  </Typography>
                </Paper>
              </Box>
              <Typography variant="body2" color="text.secondary" align="center" paragraph>
                Manual entry code: ABCDEFGHIJKLMNOP
              </Typography>
              <TextField
                fullWidth
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                margin="normal"
              />
            </>
          )}
          
          {dialogType === 'email' && (
            <>
              <Typography variant="body1" paragraph>
                To enable email verification, we'll send a verification code to your email address.
              </Typography>
              <TextField
                fullWidth
                label="Email Address"
                defaultValue="user@example.com"
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                margin="normal"
              />
            </>
          )}
          
          {dialogType === 'phone' && (
            <>
              <Typography variant="body1" paragraph>
                To enable phone verification, we'll send a verification code to your phone number.
              </Typography>
              <TextField
                fullWidth
                label="Phone Number"
                defaultValue="+1 (555) 123-4567"
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Verification Code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleVerifyCode}
            variant="contained"
            color="primary"
            disabled={isLoading || !verificationCode}
            startIcon={isLoading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Security; 