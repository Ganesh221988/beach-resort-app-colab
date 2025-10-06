import React, { useState, useRef } from 'react';
import { Upload, X, Image, Video, FileText, User, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { fileStorageService, imageUtils, FileUploadResult } from '../../services/fileStorageService';
import { useAuth } from '../../contexts/AuthContext';

interface FileUploadProps {
  type: 'image' | 'video' | 'document' | 'avatar';
  onUploadComplete: (result: FileUploadResult) => void;
  onUploadError?: (error: string) => void;
  propertyId?: string;
  documentType?: string;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  children?: React.ReactNode;
}

export function FileUpload({
  type,
  onUploadComplete,
  onUploadError,
  propertyId,
  documentType = 'general',
  multiple = false,
  maxFiles = 10,
  className = '',
  children
}: FileUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIcon = () => {
    switch (type) {
      case 'image': return Image;
      case 'video': return Video;
      case 'document': return FileText;
      case 'avatar': return User;
      default: return Upload;
    }
  };

  const getAcceptedTypes = () => {
    switch (type) {
      case 'image':
      case 'avatar':
        return 'image/jpeg,image/jpg,image/png,image/webp';
      case 'video':
        return 'video/mp4,video/webm,video/mov,video/avi';
      case 'document':
        return 'application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      default:
        return '*/*';
    }
  };

  const validateFile = (file: File) => {
    switch (type) {
      case 'image':
      case 'avatar':
        return imageUtils.validateImage(file);
      case 'video':
        return imageUtils.validateVideo(file);
      case 'document':
        // Basic document validation
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          return { valid: false, error: 'Document size must be less than 10MB' };
        }
        return { valid: true };
      default:
        return { valid: true };
    }
  };

  const uploadFile = async (file: File) => {
    if (!user) {
      onUploadError?.('Please log in to upload files');
      return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
      onUploadError?.(validation.error || 'Invalid file');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let result: FileUploadResult;

      // Progress callback
      const onProgress = (progress: any) => {
        setUploadProgress(progress.percentage);
      };

      // Upload based on type
      switch (type) {
        case 'image':
          if (!propertyId) {
            throw new Error('Property ID required for image upload');
          }
          // Optimize image before upload
          const optimizedImage = await imageUtils.resizeImage(file, 1920, 1080, 0.8);
          result = await fileStorageService.uploadPropertyImage(user.id, propertyId, optimizedImage, onProgress);
          break;

        case 'video':
          if (!propertyId) {
            throw new Error('Property ID required for video upload');
          }
          result = await fileStorageService.uploadPropertyVideo(user.id, propertyId, file, onProgress);
          break;

        case 'avatar':
          // Optimize avatar before upload
          const optimizedAvatar = await imageUtils.resizeImage(file, 400, 400, 0.8);
          result = await fileStorageService.uploadUserAvatar(user.id, optimizedAvatar);
          break;

        case 'document':
          result = await fileStorageService.uploadDocument(user.id, documentType, file);
          break;

        default:
          throw new Error('Unsupported file type');
      }

      if (result.success) {
        onUploadComplete(result);
      } else {
        onUploadError?.(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    if (!multiple && fileArray.length > 1) {
      onUploadError?.('Please select only one file');
      return;
    }

    if (multiple && fileArray.length > maxFiles) {
      onUploadError?.(`Please select no more than ${maxFiles} files`);
      return;
    }

    // Upload files
    fileArray.forEach(uploadFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const Icon = getIcon();

  if (children) {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptedTypes()}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        <div onClick={() => fileInputRef.current?.click()}>
          {children}
        </div>
        
        {uploading && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Loader className="h-4 w-4 text-blue-600 animate-spin" />
              <span className="text-sm text-blue-700">Uploading... {uploadProgress}%</span>
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedTypes()}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />
      
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${dragActive 
            ? 'border-orange-500 bg-orange-50' 
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <div className="space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
            dragActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {uploading ? (
              <Loader className="h-6 w-6 animate-spin" />
            ) : (
              <Icon className="h-6 w-6" />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              {uploading ? 'Uploading...' : `Upload ${type === 'avatar' ? 'Profile Picture' : type}`}
            </p>
            <p className="text-sm text-gray-600">
              {dragActive 
                ? 'Drop files here' 
                : `Drag and drop ${multiple ? 'files' : 'a file'} here, or click to browse`
              }
            </p>
          </div>
          
          {!uploading && (
            <div className="text-xs text-gray-500">
              {type === 'image' && 'JPEG, PNG, WebP up to 10MB'}
              {type === 'video' && 'MP4, WebM, MOV up to 100MB'}
              {type === 'document' && 'PDF, DOC, DOCX up to 10MB'}
              {type === 'avatar' && 'JPEG, PNG up to 5MB'}
              {multiple && ` • Max ${maxFiles} files`}
            </div>
          )}
        </div>
        
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">{uploadProgress}% complete</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Image Gallery Component
interface ImageGalleryProps {
  images: string[];
  onRemove?: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  editable?: boolean;
}

export function ImageGallery({ images, onRemove, onReorder, editable = false }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`Property ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(image)}
            />
            
            {editable && onRemove && (
              <button
                onClick={() => onRemove(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
              {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-gray-300 rounded-lg transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Property"
              className="max-w-full max-h-full object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}