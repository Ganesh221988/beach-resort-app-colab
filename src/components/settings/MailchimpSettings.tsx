import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  Chip
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MailchimpConfig } from '../../types/settings';

interface MailchimpSettingsProps {
  config: MailchimpConfig;
  onUpdate: (config: Partial<MailchimpConfig>) => Promise<void>;
  onTest: (apiKey: string) => Promise<boolean>;
}

const validationSchema = Yup.object({
  apiKey: Yup.string()
    .required('API Key is required')
    .matches(
      /^[0-9a-f]{32}-us[0-9]{1,2}$/,
      'Invalid Mailchimp API key format'
    ),
  listId: Yup.string().required('List ID is required')
});

const MailchimpSettings: React.FC<MailchimpSettingsProps> = ({
  config,
  onUpdate,
  onTest
}) => {
  const [testing, setTesting] = useState(false);

  const formik = useFormik({
    initialValues: {
      apiKey: config.apiKey || '',
      listId: config.listId || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onUpdate(values);
        formik.setSubmitting(false);
      } catch (error) {
        console.error('Failed to update Mailchimp settings:', error);
        formik.setSubmitting(false);
      }
    }
  });

  const handleTestConnection = async () => {
    if (!formik.values.apiKey) return;

    setTesting(true);
    try {
      const success = await onTest(formik.values.apiKey);
      if (success) {
        // You can add success notification here
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      // You can add error notification here
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Mailchimp Integration"
        action={
          config.connected && (
            <Chip
              label="Connected"
              color="success"
              size="small"
              sx={{ mr: 1 }}
            />
          )
        }
      />
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            {config.lastSync && (
              <Typography variant="caption" color="textSecondary">
                Last synced: {new Date(config.lastSync).toLocaleString()}
              </Typography>
            )}

            <Alert severity="info">
              Connect your Mailchimp account to send bulk emails to your contacts.
              You can find your API key in your Mailchimp account settings.
            </Alert>

            <TextField
              fullWidth
              label="Mailchimp API Key"
              name="apiKey"
              type="password"
              value={formik.values.apiKey}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.apiKey && Boolean(formik.errors.apiKey)}
              helperText={formik.touched.apiKey && formik.errors.apiKey}
            />

            <TextField
              fullWidth
              label="List ID"
              name="listId"
              value={formik.values.listId}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.listId && Boolean(formik.errors.listId)}
              helperText={formik.touched.listId && formik.errors.listId}
            />

            <Box display="flex" gap={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={handleTestConnection}
                disabled={!formik.values.apiKey || testing}
              >
                {testing ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Testing...
                  </>
                ) : (
                  'Test Connection'
                )}
              </Button>

              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting || !formik.dirty}
              >
                {formik.isSubmitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default MailchimpSettings;
