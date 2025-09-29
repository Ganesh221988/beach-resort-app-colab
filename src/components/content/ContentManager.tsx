import React, { useState, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  IconButton
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../services/api';

interface ContentManagerProps {
  propertyId: string;
  initialContent?: {
    title: string;
    description: string;
    keywords: string[];
    images: string[];
  };
  onUpdate?: () => void;
}

const ContentManager: React.FC<ContentManagerProps> = ({
  propertyId,
  initialContent,
  onUpdate
}) => {
  const [content, setContent] = useState(initialContent || {
    title: '',
    description: '',
    keywords: [],
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);
    const formData = new FormData();
    
    acceptedFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await api.post(`/content/${propertyId}/images`, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / (progressEvent.total || 1)) * 100;
          setUploadProgress(Math.round(progress));
        }
      });

      setContent(prev => ({
        ...prev,
        images: [...prev.images, ...response.data.data.images]
      }));

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  }, [propertyId, onUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  const handleContentUpdate = async () => {
    setLoading(true);
    try {
      await api.put(`/content/${propertyId}/content`, content);
      
      // Generate SEO metadata
      await api.post(`/content/${propertyId}/seo`);

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !content.keywords.includes(newKeyword.trim())) {
      setContent(prev => ({
        ...prev,
        keywords: [...prev.keywords, newKeyword.trim()]
      }));
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setContent(prev => ({
      ...prev,
      keywords: prev.keywords.filter(k => k !== keyword)
    }));
  };

  const handleRemoveImage = async (imageUrl: string) => {
    try {
      setContent(prev => ({
        ...prev,
        images: prev.images.filter(img => img !== imageUrl)
      }));
      await api.delete(`/content/${propertyId}/images`, {
        data: { imageUrl }
      });
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Content Management
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={content.title}
              onChange={(e) => setContent(prev => ({ ...prev, title: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={content.description}
              onChange={(e) => setContent(prev => ({ ...prev, description: e.target.value }))}
            />
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" gap={1}>
              <TextField
                fullWidth
                label="Add Keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <IconButton onClick={handleAddKeyword}>
                <AddIcon />
              </IconButton>
            </Box>
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              {content.keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 2,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main'
                }
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <Typography>Drop the files here...</Typography>
              ) : (
                <Typography>
                  Drag 'n' drop images here, or click to select files
                </Typography>
              )}
              {uploadProgress > 0 && (
                <Box mt={2}>
                  <CircularProgress variant="determinate" value={uploadProgress} />
                </Box>
              )}
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {content.images.map((image) => (
                <Grid item key={image} xs={12} sm={6} md={4}>
                  <Box position="relative">
                    <img
                      src={image}
                      alt="Property"
                      style={{
                        width: '100%',
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(image)}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        bgcolor: 'background.paper'
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleContentUpdate}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Update Content'}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ContentManager;
