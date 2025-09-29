import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Avatar,
  IconButton,
  Stack,
  Typography,
  CircularProgress
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UserProfile, ProfileUpdateData } from '../../types/settings';

interface ProfileSettingsProps {
  profile: UserProfile;
  onUpdate: (data: ProfileUpdateData) => Promise<void>;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string()
    .matches(/^\+?[\d\s-]{10,}$/, 'Invalid phone number')
    .required('Phone number is required')
});

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onUpdate }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formik = useFormik({
    initialValues: {
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      avatar: undefined as File | undefined
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await onUpdate(values);
        formik.setSubmitting(false);
      } catch (error) {
        console.error('Failed to update profile:', error);
        formik.setSubmitting(false);
      }
    }
  });

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size should be less than 5MB');
      }

      formik.setFieldValue('avatar', file);
    } catch (error) {
      console.error('Avatar upload failed:', error);
      // You can add error notification here
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Profile Settings" />
      <CardContent>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={3}>
            <Box display="flex" justifyContent="center" mb={2}>
              <Box position="relative" display="inline-block">
                <Avatar
                  src={
                    formik.values.avatar
                      ? URL.createObjectURL(formik.values.avatar)
                      : profile.avatar
                  }
                  sx={{ width: 100, height: 100, cursor: 'pointer' }}
                  onClick={handleAvatarClick}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: -10,
                    backgroundColor: 'background.paper'
                  }}
                  size="small"
                  onClick={handleAvatarClick}
                  disabled={uploading}
                >
                  {uploading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <PhotoCamera fontSize="small" />
                  )}
                </IconButton>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Box>
            </Box>

            <Typography variant="subtitle2" color="textSecondary">
              Role: {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
            </Typography>

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />

            <Box display="flex" justifyContent="flex-end">
              <Button
                type="submit"
                variant="contained"
                disabled={formik.isSubmitting || !formik.dirty}
              >
                {formik.isSubmitting ? (
                  <>
                    <CircularProgress size={24} sx={{ mr: 1 }} />
                    Updating...
                  </>
                ) : (
                  'Update Profile'
                )}
              </Button>
            </Box>
          </Stack>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
