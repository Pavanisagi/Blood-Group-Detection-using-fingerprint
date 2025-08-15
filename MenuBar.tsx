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
  Container,
  Avatar,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Divider,
  Tooltip,
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
  Brightness4 as Brightness4Icon,
  Brightness7 as Brightness7Icon,
  SettingsBrightness as SettingsBrightnessIcon,
  ContactSupport as ContactSupportIcon,
  ChevronLeft as ChevronLeftIcon,
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
  { text: 'Contact Us', icon: <ContactSupportIcon />, path: '/contact' },
];

// User menu items
const userMenuItems = [
  { text: 'Security', icon: <SecurityIcon />, path: '/security' },
];

const themeOptions = [
  { text: 'Light', icon: <LightModeIcon />, mode: 'light' },
  { text: 'Dark', icon: <DarkModeIcon />, mode: 'dark' },
  { text: 'System', icon: <BrightnessAutoIcon />, mode: 'system' },
];

const MenuBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const { themeMode, setThemeMode } = useThemeContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const handleNavigation = (path: string) => {
    navigate(path);
    handleUserMenuClose();
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleUserMenuClose();
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode);
    handleThemeMenuClose();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <Brightness7Icon />;
      case 'dark':
        return <Brightness4Icon />;
      default:
        return <SettingsBrightnessIcon />;
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Mobile drawer content
  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)'
            : 'linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%)',
          color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Blood Group Predictor
        </Typography>
        <IconButton onClick={toggleMobileMenu} color="inherit">
          <ChevronLeftIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Main Menu
        </Typography>
        {mainMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          More Features
        </Typography>
        {secondaryMenuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: theme.palette.mode === 'dark' 
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: themeMode === 'dark' 
            ? 'linear-gradient(90deg, rgba(18,18,18,0.95) 0%, rgba(30,30,30,0.95) 100%)'
            : 'linear-gradient(90deg, rgba(248,249,250,0.95) 0%, rgba(255,255,255,0.95) 100%)',
          backdropFilter: 'blur(8px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 64 }}>
            {/* Logo and Mobile Menu Button */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
                onClick={toggleMobileMenu}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <BloodtypeIcon sx={{ mr: 1 }} />
                Blood Group Predictor
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              {mainMenuItems.map((item) => (
                <Button
                  key={item.text}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    transition: 'all 0.2s ease-in-out',
                    backgroundColor: location.pathname === item.path
                      ? theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  }}
                >
                  {item.icon}
                  <Typography variant="body2">
                    {item.text}
                  </Typography>
                </Button>
              ))}
            </Box>

            {/* Right Side Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Theme Toggle */}
              <Tooltip title="Change theme">
                <IconButton onClick={handleThemeMenuOpen} color="inherit">
                  {getThemeIcon()}
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={themeMenuAnchorEl}
                open={Boolean(themeMenuAnchorEl)}
                onClose={handleThemeMenuClose}
                onClick={handleThemeMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {themeOptions.map((option) => (
                  <MenuItem 
                    key={option.mode} 
                    onClick={() => handleThemeChange(option.mode as 'light' | 'dark' | 'system')}
                  >
                    <ListItemIcon>
                      {option.icon}
                    </ListItemIcon>
                    <ListItemText>{option.text}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>

              {/* User Menu or Login Button */}
              {isAuthenticated ? (
                <>
                  <Tooltip title="Account settings">
                    <IconButton onClick={handleUserMenuOpen} color="inherit">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                        <PersonIcon />
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={userMenuAnchorEl}
                    open={Boolean(userMenuAnchorEl)}
                    onClose={handleUserMenuClose}
                    onClick={handleUserMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    {userMenuItems.map((item) => (
                      <MenuItem key={item.text} onClick={() => handleNavigation(item.path)}>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText>{item.text}</ListItemText>
                      </MenuItem>
                    ))}
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <LoginIcon />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<LoginIcon />}
                  onClick={() => handleNavigation('/login')}
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 500,
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {mobileDrawer}
    </>
  );
};

export default MenuBar; 