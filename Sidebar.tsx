import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Typography,
  Divider,
  IconButton,
  Collapse,
  useTheme,
  useMediaQuery,
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
  ChevronLeft as ChevronLeftIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'AI Blood Predictor', icon: <BloodtypeIcon />, path: '/ai-predictor' },
  { text: 'Health Score', icon: <TimelineIcon />, path: '/health-score' },
  { text: 'AI Dashboard', icon: <PsychologyIcon />, path: '/ai-dashboard' },
  { text: '3D Visualization', icon: <ScienceIcon />, path: '/visualization' },
  { text: 'Blood Donors', icon: <PeopleIcon />, path: '/blood-donors' },
  { text: 'Feedback', icon: <FeedbackIcon />, path: '/feedback' },
  { text: 'Security', icon: <SecurityIcon />, path: '/security' },
];

interface SidebarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <IconButton
        color="primary"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 1200,
          bgcolor: 'white',
          boxShadow: 2,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: open ? 240 : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #1a237e 0%, #0d47a1 100%)',
            color: 'white',
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ p: 2, textAlign: 'center', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Blood Group Predictor
            </Typography>
          </motion.div>
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ color: 'white' }}
          >
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.12)' }} />
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem disablePadding>
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) {
                        setOpen(false);
                      }
                    }}
                    sx={{
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(255, 255, 255, 0.08)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.12)',
                        },
                        '& .MuiListItemIcon-root': {
                          color: 'white',
                        },
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))}
          </List>
        </Collapse>
      </Drawer>
    </>
  );
};

export default Sidebar; 