import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  FormHelperText,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Property } from '../../types/property';
import { LoadingButton } from '@mui/lab';

interface AutoPostGeneratorProps {
  properties: Property[];
  onGeneratePost: (data: PostGenerationData) => Promise<void>;
  onSchedulePost: (data: ScheduledPostData) => Promise<void>;
  loading: boolean;
}

export interface PostGenerationData {
  propertyId: string;
  platforms: ('facebook' | 'instagram')[];
  template: string;
  customText?: string;
  includeImages: boolean;
  scheduledTime?: Date;
}

export interface ScheduledPostData extends PostGenerationData {
  scheduledTime: Date;
}

const POST_TEMPLATES = [
  {
    id: 'new-listing',
    label: 'New Listing Announcement',
    template: '🏠 New Property Alert! \n\n{{propertyName}} is now available for booking! ' +
      '\n\n✨ Features:\n{{features}}\n\n📍 Location: {{location}}\n💰 Starting from: {{price}}/night' +
      '\n\nBook now at: {{bookingLink}}'
  },
  {
    id: 'special-offer',
    label: 'Special Offer',
    template: '🎉 Special Offer Alert! \n\n{{propertyName}}\n\n' +
      'Book your stay at this amazing property and enjoy:\n{{features}}\n\n' +
      '📅 Limited time offer\n💰 Special price: {{price}}/night\n\nBook now: {{bookingLink}}'
  },
  {
    id: 'weekend-getaway',
    label: 'Weekend Getaway',
    template: '🌅 Weekend Getaway Goals!\n\nEscape to {{propertyName}} this weekend!\n\n' +
      'Perfect for a relaxing stay featuring:\n{{features}}\n\n' +
      '📍 {{location}}\n💫 Book now: {{bookingLink}}'
  }
];

const AutoPostGenerator: React.FC<AutoPostGeneratorProps> = ({
  properties,
  onGeneratePost,
  onSchedulePost,
  loading
}) => {
  const [selectedProperty, setSelectedProperty] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<('facebook' | 'instagram')[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customText, setCustomText] = useState<string>('');
  const [includeImages, setIncludeImages] = useState<boolean>(true);
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [scheduledTime, setScheduledTime] = useState<Date | null>(null);

  const handleSubmit = async () => {
    const postData: PostGenerationData = {
      propertyId: selectedProperty,
      platforms: selectedPlatforms,
      template: selectedTemplate,
      customText: customText.trim() || undefined,
      includeImages,
      scheduledTime: isScheduled ? scheduledTime || undefined : undefined
    };

    if (isScheduled && scheduledTime) {
      await onSchedulePost({
        ...postData,
        scheduledTime
      });
    } else {
      await onGeneratePost(postData);
    }
  };

  const isValid = selectedProperty && selectedPlatforms.length > 0 && 
    selectedTemplate && (!isScheduled || (isScheduled && scheduledTime));

  return (
    <Card>
      <CardHeader title="Auto Post Generator" />
      <CardContent>
        <Stack spacing={3}>
          <Typography variant="body2" color="textSecondary">
            Generate and schedule social media posts for your properties automatically
          </Typography>

          <FormControl fullWidth>
            <InputLabel>Select Property</InputLabel>
            <Select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              label="Select Property"
            >
              {properties.map((property) => (
                <MenuItem key={property.id} value={property.id}>
                  {property.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <Typography variant="subtitle2" gutterBottom>
              Select Platforms
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label="Facebook"
                onClick={() => {
                  const newPlatforms: ('facebook' | 'instagram')[] = selectedPlatforms.includes('facebook')
                    ? selectedPlatforms.filter(p => p !== 'facebook') as ('facebook' | 'instagram')[]
                    : [...selectedPlatforms, 'facebook'];
                  setSelectedPlatforms(newPlatforms);
                }}
                color={selectedPlatforms.includes('facebook') ? 'primary' : 'default'}
                clickable
              />
              <Chip
                label="Instagram"
                onClick={() => {
                  const newPlatforms: ('facebook' | 'instagram')[] = selectedPlatforms.includes('instagram')
                    ? selectedPlatforms.filter(p => p !== 'instagram') as ('facebook' | 'instagram')[]
                    : [...selectedPlatforms, 'instagram'];
                  setSelectedPlatforms(newPlatforms);
                }}
                color={selectedPlatforms.includes('instagram') ? 'primary' : 'default'}
                clickable
              />
            </Stack>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Select Template</InputLabel>
            <Select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              label="Select Template"
            >
              {POST_TEMPLATES.map((template) => (
                <MenuItem key={template.id} value={template.id}>
                  {template.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Custom Text (Optional)"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            helperText="Add any custom text to append to the template"
          />

          <FormControlLabel
            control={
              <Switch
                checked={includeImages}
                onChange={(e) => setIncludeImages(e.target.checked)}
              />
            }
            label="Include Property Images"
          />

          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <FormControlLabel
                control={
                  <Switch
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                  />
                }
                label="Schedule Post"
              />
            </Grid>
            {isScheduled && (
              <Grid item xs>
                <DateTimePicker
                  label="Schedule Time"
                  value={scheduledTime}
                  onChange={(newValue) => setScheduledTime(newValue)}
                  disablePast
                />
              </Grid>
            )}
          </Grid>

          <LoadingButton
            variant="contained"
            onClick={handleSubmit}
            disabled={!isValid}
            loading={loading}
            fullWidth
          >
            {isScheduled ? 'Schedule Post' : 'Generate & Post Now'}
          </LoadingButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default AutoPostGenerator;
