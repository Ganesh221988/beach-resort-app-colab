import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import {
  Facebook,
  Instagram,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { SocialMediaAccounts } from '../../types/settings';

interface SocialMediaSettingsProps {
  accounts: SocialMediaAccounts;
  onConnect: (platform: 'facebook' | 'instagram') => Promise<void>;
  onDisconnect: (platform: 'facebook' | 'instagram') => Promise<void>;
  onRefreshToken: (platform: 'facebook' | 'instagram') => Promise<void>;
  loading: boolean;
}

const SocialMediaSettings: React.FC<SocialMediaSettingsProps> = ({
  accounts,
  onConnect,
  onDisconnect,
  onRefreshToken,
  loading
}) => {
  const renderAccountInfo = (
    platform: 'facebook' | 'instagram',
    account: typeof accounts.facebook | typeof accounts.instagram
  ) => {
    if (!account) return null;

    const name = platform === 'facebook' ? 
      (account as { pageName: string }).pageName : 
      (account as { username: string }).username;

    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <Box>
          <Typography variant="subtitle1">{name}</Typography>
          <Typography variant="caption" color="textSecondary">
            {platform === 'facebook' ? 'Page ID: ' : 'Account ID: '}
            {platform === 'facebook' ? (account as { pageId: string }).pageId : (account as { accountId: string }).accountId}
          </Typography>
        </Box>
        <Box>
          <IconButton
            size="small"
            onClick={() => onRefreshToken(platform)}
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onDisconnect(platform)}
            disabled={loading}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardHeader title="Social Media Integration" />
      <CardContent>
        <Stack spacing={3}>
          <Alert severity="info">
            Connect your social media accounts to enable automatic posting of your
            properties and updates.
          </Alert>

          <Box>
            <Typography variant="h6" gutterBottom>
              Facebook
              {accounts.facebook && (
                <Chip
                  label="Connected"
                  color="success"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            {accounts.facebook ? (
              renderAccountInfo('facebook', accounts.facebook)
            ) : (
              <Button
                startIcon={<Facebook />}
                variant="outlined"
                onClick={() => onConnect('facebook')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Connecting...
                  </>
                ) : (
                  'Connect Facebook Page'
                )}
              </Button>
            )}
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Instagram
              {accounts.instagram && (
                <Chip
                  label="Connected"
                  color="success"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Typography>
            {accounts.instagram ? (
              renderAccountInfo('instagram', accounts.instagram)
            ) : (
              <Button
                startIcon={<Instagram />}
                variant="outlined"
                onClick={() => onConnect('instagram')}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Connecting...
                  </>
                ) : (
                  'Connect Instagram Account'
                )}
              </Button>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettings;
