import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';
import SettingsMenu from '../common/SettingsMenu';

const BrokerHeader = () => {
  const auth = React.useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Broker Dashboard
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ mr: 2 }}>
            {auth?.user?.name}
          </Typography>
          <SettingsMenu />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default BrokerHeader;
