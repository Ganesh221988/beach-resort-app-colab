import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

interface ImageSize {
  width: number;
  height: number;
  suffix: string;
}

const IMAGE_SIZES: ImageSize[] = [
  { width: 320, height: 240, suffix: 'sm' },
  { width: 640, height: 480, suffix: 'md' },
  { width: 1280, height: 960, suffix: 'lg' },
  { width: 1920, height: 1440, suffix: 'xl' }
];

export class ImageService {
  private uploadDir: string;
  private cachePath: string;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads', 'images');
    this.cachePath = path.join(process.cwd(), 'uploads', 'cache');
    this.ensureDirectories();
  }

  private async ensureDirectories() {
    await fs.mkdir(this.uploadDir, { recursive: true });
    await fs.mkdir(this.cachePath, { recursive: true });
  }

  async optimizeAndSave(file: Express.Multer.File): Promise<string[]> {
    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const urls: string[] = [];

    // Process image in different sizes
    for (const size of IMAGE_SIZES) {
      const optimizedFilename = `${path.parse(filename).name}-${size.suffix}${path.extname(filename)}`;
      const filePath = path.join(this.uploadDir, optimizedFilename);

      await sharp(file.buffer)
        .resize(size.width, size.height, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toFile(filePath);

      urls.push(`/images/${optimizedFilename}`);
    }

    // Save original file
    await fs.writeFile(
      path.join(this.uploadDir, filename),
      file.buffer
    );

    return urls;
  }

  async generateBlurHash(file: Express.Multer.File): Promise<string> {
    const { data, info } = await sharp(file.buffer)
      .resize(32, 32, { fit: 'inside' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // Implementation of blur hash algorithm
    // This is a simplified version, you might want to use a proper blur hash library
    return Buffer.from(data).toString('base64');
  }

  async deleteImage(filename: string): Promise<void> {
    const filePath = path.join(this.uploadDir, filename);
    await fs.unlink(filePath);

    // Also delete all sized versions
    for (const size of IMAGE_SIZES) {
      const sizedFilename = `${path.parse(filename).name}-${size.suffix}${path.extname(filename)}`;
      const sizedFilePath = path.join(this.uploadDir, sizedFilename);
      await fs.unlink(sizedFilePath).catch(() => {});
    }
  }

  async clearCache(): Promise<void> {
    const files = await fs.readdir(this.cachePath);
    await Promise.all(
      files.map(file => fs.unlink(path.join(this.cachePath, file)))
    );
  }
}
