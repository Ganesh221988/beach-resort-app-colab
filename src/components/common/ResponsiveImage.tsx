import React, { useState, useEffect } from 'react';
import { Box, Skeleton } from '@mui/material';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  blurHash?: string;
  aspectRatio?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  blurHash,
  aspectRatio = 16/9,
  priority = false,
  sizes = '100vw',
  className,
  onLoad,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsLoading(false);
        onLoad?.();
      };
      img.onerror = () => {
        setError(true);
        onError?.();
      };
    }
  }, [src, priority, onLoad, onError]);

  // Calculate responsive image sizes
  const generateSrcSet = () => {
    const widths = [320, 640, 960, 1280, 1920];
    const basePath = src.split('?')[0];
    return widths
      .map(width => `${basePath}?w=${width} ${width}w`)
      .join(', ');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        paddingTop: `${100 / aspectRatio}%`,
        backgroundColor: 'grey.100',
        overflow: 'hidden'
      }}
      className={className}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
          animation="wave"
        />
      )}

      {!error && (
        <img
          src={src}
          alt={alt}
          srcSet={generateSrcSet()}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      )}

      {blurHash && isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'grey.100',
            filter: 'blur(20px)',
            transform: 'scale(1.2)',
            backgroundImage: `url(data:image/jpeg;base64,${blurHash})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}

      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'grey.100',
            color: 'text.secondary'
          }}
        >
          Failed to load image
        </Box>
      )}
    </Box>
  );
};

export default ResponsiveImage;
