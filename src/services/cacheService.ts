// import Redis from 'ioredis';
import { promisify } from 'util';
import { logger } from '../utils/logger';
import * as zlib from 'zlib';

const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

export class CacheService {
  // private redis: Redis;
  private defaultTTL: number;
  private compressionThreshold: number;

  constructor() {
    // const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    // this.redis = new Redis(redisUrl);

    this.defaultTTL = 3600; // 1 hour in seconds
    this.compressionThreshold = 1024; // Compress data larger than 1KB


  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = null; // Redis call removed
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttl: number = this.defaultTTL): Promise<void> {
    try {
      // await this.redis.set(key, JSON.stringify(value), 'EX', ttl); // Redis call removed
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      // await this.redis.del(key); // Redis call removed
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = []; // Redis call removed
      if (keys.length > 0) {
        // await this.redis.del(...keys); // Redis call removed
      }
    } catch (error) {
      console.error('Cache invalidate pattern error:', error);
    }
  }

  async setHash(key: string, fields: Record<string, any>): Promise<void> {
    try {
      const serializedFields = Object.entries(fields).reduce((acc, [field, value]) => {
        acc[field] = JSON.stringify(value);
        return acc;
      }, {} as Record<string, string>);

      // await this.redis.hmset(key, serializedFields); // Redis call removed
    } catch (error) {
      console.error('Cache setHash error:', error);
    }
  }

  async getHash<T>(key: string): Promise<Record<string, T> | null> {
    try {
      const hash = {}; // Redis call removed
      if (Object.keys(hash).length === 0) return null;

      return Object.entries(hash).reduce((acc, [field, value]) => {
        acc[field] = JSON.parse(value as string);
        return acc;
      }, {} as Record<string, T>);
    } catch (error) {
      console.error('Cache getHash error:', error);
      return null;
    }
  }
}
