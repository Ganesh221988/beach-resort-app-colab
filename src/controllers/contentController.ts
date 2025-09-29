import { Request, Response } from 'express';
import { ImageService } from '../services/imageService';
import Property from '../models/Property';
import { Op } from 'sequelize';

const imageService = new ImageService();

interface ContentMetadata {
  title: string;
  description: string;
  keywords: string[];
  images: string[];
  seoDescription?: string;
  seoTitle?: string;
}

export const uploadPropertyImages = async (req: Request, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files)) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    const propertyId = req.params.propertyId;
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const imageUrls: string[] = [];
    const blurHashes: string[] = [];

    for (const file of req.files as Express.Multer.File[]) {
      const urls = await imageService.optimizeAndSave(file);
      const blurHash = await imageService.generateBlurHash(file);
      
      imageUrls.push(...urls);
      blurHashes.push(blurHash);
    }

    // Update property images
    await property.update({
      images: [...(property.images || []), ...imageUrls],
      imageBlurHashes: [...(property.imageBlurHashes || []), ...blurHashes]
    });

    return res.json({
      success: true,
      data: {
        images: imageUrls,
        blurHashes
      }
    });

  } catch (error) {
    console.error('Error uploading property images:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading property images'
    });
  }
};

export const updatePropertyContent = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const content: ContentMetadata = req.body;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    await property.update({
      title: content.title,
      description: content.description,
      keywords: content.keywords,
      seoMetadata: {
        title: content.seoTitle || content.title,
        description: content.seoDescription || content.description,
        keywords: content.keywords,
        ogImage: content.images[0] || '', // Use first image as og:image if available
        structuredData: {
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": content.title,
          "description": content.description
        }
      }
    });

    return res.json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error('Error updating property content:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating property content'
    });
  }
};

export const generateSEOMetadata = async (req: Request, res: Response) => {
  try {
    const { propertyId } = req.params;
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Generate SEO-friendly metadata
    const seoMetadata = {
      title: `${property.title} - Beach Resort Accommodation`,
      description: property.description.substring(0, 160), // Optimal meta description length
      keywords: [
        ...property.keywords,
        'beach resort',
        'accommodation',
        property.location,
        'vacation rental'
      ],
      canonical: `${process.env.FRONTEND_URL}/properties/${propertyId}`,
      ogImage: property.images?.[0] || '',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        name: property.title,
        description: property.description,
        image: property.images,
        address: {
          '@type': 'PostalAddress',
          addressLocality: property.location
        },
        priceRange: `$${property.pricePerNight} per night`
      }
    };

    await property.update({ seoMetadata });

    return res.json({
      success: true,
      data: seoMetadata
    });

  } catch (error) {
    console.error('Error generating SEO metadata:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating SEO metadata'
    });
  }
};
