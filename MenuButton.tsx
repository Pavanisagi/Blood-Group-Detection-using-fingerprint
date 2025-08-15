import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  Button,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Tooltip,
  Badge,
  Container,
} from '@mui/material';
import {
  Home as HomeIcon,
  Science as ScienceIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Psychology as PsychologyIcon,
  Feedback as FeedbackIcon,
  Bloodtype as BloodtypeIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  Login as LoginIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  BrightnessAuto as BrightnessAutoIcon,
  ChevronLeft as ChevronLeftIcon,
  Notifications as NotificationsIcon,
  HealthAndSafety,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useThemeContext } from '../context/ThemeContext';

// Main navigation items
const mainMenuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Blood Predictor', icon: <BloodtypeIcon />, path: '/ai-predictor' },
  { text: 'Health Score', icon: <TimelineIcon />, path: '/health-score' },
  { text: 'Blood Donors', icon: <PeopleIcon />, path: '/blood-donors' },
];

// Secondary navigation items
const secondaryMenuItems = [
  { text: 'AI Dashboard', icon: <PsychologyIcon />, path: '/ai-dashboard' },
  { text: '3D Visualization', icon: <ScienceIcon />, path: '/visualization' },
  { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' },
];

// User menu items
const userMenuItems = [
  { text: 'My Health Data', icon: <HealthAndSafety />, path: '/health-score' },
  { text: 'My Blood History', icon: <BloodtypeIcon />, path: '/blood-donors' },
  { text: 'Security & Privacy', icon: <SecurityIcon />, path: '/security' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

const themeOptions = [
  { text: 'Light', icon: <LightModeIcon />, mode: 'light' },
  { text: 'Dark', icon: <DarkModeIcon />, mode: 'dark' },
  { text: 'System', icon: <BrightnessAutoIcon />, mode: 'system' },
];

const MenuButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { themeMode, setThemeMode } = useThemeContext();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [themeMenuAnchorEl, setThemeMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeMenuAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchorEl(null);
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    handleThemeMenuClose();
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const drawer = (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            : 'linear-gradient(135deg, #f5f5f5 0%, #e0f7fa 100%)',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Blood Group Predictor
        </Typography>
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'inherit' : undefined }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      
      <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
        More Features
      </Typography>
      <List>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={isActive(item.path)}
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? 'inherit' : undefined }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        {themeOptions.map((option) => (
          <ListItem key={option.text} disablePadding>
            <ListItemButton
              selected={themeMode === option.mode}
              onClick={() => handleThemeChange(option.mode as 'light' | 'dark' | 'system')}
              sx={{
                borderRadius: 1,
                mx: 1,
                my: 0.5,
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: themeMode === option.mode ? 'inherit' : undefined }}>
                {option.icon}
              </ListItemIcon>
              <ListItemText primary={option.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        elevation={4}
        sx={{
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)'
            : 'linear-gradient(135deg, #3f51b5 0%, #757de8 100%)',
          color: 'white',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component={motion.div}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                sx={{ 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'white',
                }}
              >
                <BloodtypeIcon sx={{ mr: 1 }} />
                Blood Group Predictor
              </Typography>
            </Box>

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 4 }}>
                {mainMenuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    onClick={() => handleNavigation(item.path)}
                    sx={{ 
                      mx: 1,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 'auto',
                      px: 2,
                    }}
                  >
                    {item.icon}
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {item.text}
                    </Typography>
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Tooltip title="Notifications">
                    <IconButton color="inherit" sx={{ mr: 1 }}>
                      <Badge badgeContent={3} color="error">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Theme">
                    <IconButton
                      color="inherit"
                      onClick={handleThemeMenuOpen}
                      sx={{ mr: 1 }}
                    >
                      {themeMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Profile">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleUserMenuOpen}
                      startIcon={<PersonIcon />}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        bgcolor: Boolean(userMenuAnchorEl) ? 'rgba(255, 255, 255, 0.9)' : 'white',
                        color: theme.palette.primary.main,
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.9)',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        boxShadow: Boolean(userMenuAnchorEl) ? `0 0 0 2px ${theme.palette.primary.main}` : 'none',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: theme.palette.primary.main, 
                            color: 'white',
                            mr: 1,
                          }}
                        >
                          {isAuthenticated ? 'U' : 'G'}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          Profile
                        </Typography>
                      </Box>
                    </Button>
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Theme">
                    <IconButton
                      color="inherit"
                      onClick={handleThemeMenuOpen}
                      sx={{ mr: 1 }}
                    >
                      {themeMode === 'light' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                  </Tooltip>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<LoginIcon />}
                    onClick={() => navigate('/login')}
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      bgcolor: 'white',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                      },
                    }}
                  >
                    Login
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Theme Menu */}
      <Menu
        anchorEl={themeMenuAnchorEl}
        open={Boolean(themeMenuAnchorEl)}
        onClose={handleThemeMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {themeOptions.map((option) => (
          <MenuItem
            key={option.text}
            onClick={() => handleThemeChange(option.mode as 'light' | 'dark' | 'system')}
            selected={themeMode === option.mode}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText>{option.text}</ListItemText>
          </MenuItem>
        ))}
      </Menu>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchorEl}
        open={Boolean(userMenuAnchorEl)}
        onClose={handleUserMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 250,
            mt: 1,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Avatar 
            sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: theme.palette.primary.main, 
              color: 'white',
              mr: 2,
            }}
          >
            {isAuthenticated ? 'U' : 'G'}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              User Profile
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isAuthenticated ? 'Signed in' : 'Guest'}
            </Typography>
          </Box>
        </Box>
        
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => {
              handleNavigation(item.path);
              handleUserMenuClose();
            }}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.text}</ListItemText>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default MenuButton; 