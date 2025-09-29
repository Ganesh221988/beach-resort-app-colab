import React, { useState } from 'react';
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  Theme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Search,
  Favorite,
  Person,
  Close as CloseIcon
} from '@mui/icons-material';
import { useResponsive } from '../../hooks/useResponsive';
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navigationItems: NavigationItem[] = [
  { label: 'Home', icon: <Home />, path: '/' },
  { label: 'Search', icon: <Search />, path: '/search' },
  { label: 'Favorites', icon: <Favorite />, path: '/favorites' },
  { label: 'Profile', icon: <Person />, path: '/profile' }
];

const ResponsiveNavigation: React.FC = () => {
  const { isMobile } = useResponsive();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
  };

  const renderNavigationItems = (orientation: 'horizontal' | 'vertical') => {
    if (orientation === 'horizontal') {
      return (
        <BottomNavigation
          value={location.pathname}
          onChange={(_, newValue) => handleNavigation(newValue)}
          showLabels
          sx={{
            width: '100%',
            position: 'fixed',
            bottom: 0,
            left: 0,
            zIndex: theme.zIndex.appBar,
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper
          }}
        >
          {navigationItems.map((item) => (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={item.icon}
              value={item.path}
            />
          ))}
        </BottomNavigation>
      );
    }

    return (
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => handleNavigation(item.path)}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderMobileNav = () => (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        onClick={() => setDrawerOpen(true)}
        sx={{ position: 'fixed', top: 16, left: 16, zIndex: theme.zIndex.appBar }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '80%',
            maxWidth: 300
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {renderNavigationItems('vertical')}
      </Drawer>

      {renderNavigationItems('horizontal')}
    </>
  );

  const renderDesktopNav = () => (
    <Box sx={{ width: 240, flexShrink: 0 }}>
      {renderNavigationItems('vertical')}
    </Box>
  );

  return isMobile ? renderMobileNav() : renderDesktopNav();
};

export default ResponsiveNavigation;
