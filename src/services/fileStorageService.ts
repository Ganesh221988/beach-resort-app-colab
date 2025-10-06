import { supabase } from '../lib/supabase';

export interface FileUploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

// File Storage Service for Supabase Storage
export const fileStorageService = {
  // Upload property image
  async uploadPropertyImage(
    userId: string, 
    propertyId: string, 
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Please upload an image file' };
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'Image size must be less than 10MB' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${propertyId}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('File upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  },

  // Upload property video
  async uploadPropertyVideo(
    userId: string, 
    propertyId: string, 
    file: File,
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        return { success: false, error: 'Please upload a video file' };
      }

      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        return { success: false, error: 'Video size must be less than 100MB' };
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${userId}/${propertyId}/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('property-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('property-videos')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Video upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  },

  // Upload user avatar
  async uploadUserAvatar(userId: string, file: File): Promise<FileUploadResult> {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return { success: false, error: 'Please upload an image file' };
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: 'Image size must be less than 5MB' };
      }

      // Generate filename
      const fileExt = file.name.split('.').pop();
      const fileName = `avatar.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload file (upsert to replace existing avatar)
      const { data, error } = await supabase.storage
        .from('user-avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-avatars')
        .getPublicUrl(filePath);

      return {
        success: true,
        url: urlData.publicUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Avatar upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  },

  // Upload document (KYC, business docs)
  async uploadDocument(
    userId: string, 
    documentType: string, 
    file: File
  ): Promise<FileUploadResult> {
    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Please upload a PDF, image, or document file' };
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'File size must be less than 10MB' };
      }

      // Generate filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/documents/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get signed URL (private bucket)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (urlError) {
        console.error('URL generation error:', urlError);
        return { success: false, error: 'Failed to generate file URL' };
      }

      return {
        success: true,
        url: urlData.signedUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Document upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  },

  // Upload document (KYC, business docs)
  async uploadDocument(
    userId: string, 
    documentType: string, 
    file: File
  ): Promise<FileUploadResult> {
    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];

      if (!allowedTypes.includes(file.type)) {
        return { success: false, error: 'Please upload a PDF, image, or document file' };
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        return { success: false, error: 'File size must be less than 10MB' };
      }

      // Generate filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${documentType}-${Date.now()}.${fileExt}`;
      const filePath = `${userId}/documents/${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { success: false, error: error.message };
      }

      // Get signed URL (private bucket)
      const { data: urlData, error: urlError } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry

      if (urlError) {
        console.error('URL generation error:', urlError);
        return { success: false, error: 'Failed to generate file URL' };
      }

      return {
        success: true,
        url: urlData.signedUrl,
        path: filePath
      };
    } catch (error) {
      console.error('Document upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  },

  // Delete file
  async deleteFile(bucket: string, filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('File deletion error:', error);
      return false;
    }
  },

  // Get file URL
  getPublicUrl(bucket: string, filePath: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  },

  // Get signed URL for private files
  async getSignedUrl(bucket: string, filePath: string, expiresIn = 3600): Promise<string | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiresIn);

      if (error) {
        console.error('Signed URL error:', error);
        return null;
      }

      return data.signedUrl;
    } catch (error) {
      console.error('Signed URL generation error:', error);
      return null;
    }
  },

  // List files in a folder
  async listFiles(bucket: string, folder: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder);

      if (error) {
        console.error('List files error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('File listing error:', error);
      return [];
    }
  },

  // Get file info
  async getFileInfo(bucket: string, filePath: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', {
          search: filePath
        });

      if (error) {
        console.error('File info error:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('File info retrieval error:', error);
      return null;
    }
  }
};

// Image optimization utilities
export const imageUtils = {
  // Resize image before upload
  async resizeImage(file: File, maxWidth: number, maxHeight: number, quality = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(resizedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  },

  // Generate thumbnail
  async generateThumbnail(file: File): Promise<File> {
    return this.resizeImage(file, 300, 300, 0.7);
  },

  // Validate image file
  validateImage(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select an image file' };
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { valid: false, error: 'Image size must be less than 10MB' };
    }

    // Check file format
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload JPEG, PNG, or WebP images only' };
    }

    return { valid: true };
  },

  // Validate video file
  validateVideo(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('video/')) {
      return { valid: false, error: 'Please select a video file' };
    }

    // Check file size (100MB)
    if (file.size > 100 * 1024 * 1024) {
      return { valid: false, error: 'Video size must be less than 100MB' };
    }

    // Check file format
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/avi'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Please upload MP4, WebM, MOV, or AVI videos only' };
    }

    return { valid: true };
  }
};