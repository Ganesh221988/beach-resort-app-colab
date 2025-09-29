import { Request, Response, NextFunction } from 'express';
import { Op } from 'sequelize';
import { CacheService } from '../services/cacheService';

const cache = new CacheService();

interface QueryOptions {
  fields?: string[];
  includes?: string[];
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
  cache?: boolean;
  cacheTTL?: number;
}

export const queryOptimizer = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalQuery = { ...req.query };
    const queryOptions: QueryOptions = {};

    // Parse fields for select optimization
    if (originalQuery.fields) {
      queryOptions.fields = (originalQuery.fields as string).split(',');
      delete originalQuery.fields;
    }

    // Parse includes for eager loading optimization
    if (originalQuery.includes) {
      queryOptions.includes = (originalQuery.includes as string).split(',');
      delete originalQuery.includes;
    }

    // Parse pagination
    if (originalQuery.page) {
      queryOptions.page = parseInt(originalQuery.page as string, 10);
      delete originalQuery.page;
    }

    if (originalQuery.limit) {
      queryOptions.limit = parseInt(originalQuery.limit as string, 10);
      delete originalQuery.limit;
    }

    // Parse sorting
    if (originalQuery.sort) {
      queryOptions.sort = originalQuery.sort as string;
      queryOptions.order = (originalQuery.order as 'ASC' | 'DESC') || 'ASC';
      delete originalQuery.sort;
      delete originalQuery.order;
    }

    // Cache control
    if (originalQuery.cache) {
      queryOptions.cache = originalQuery.cache === 'true';
      queryOptions.cacheTTL = originalQuery.cacheTTL ? 
        parseInt(originalQuery.cacheTTL as string, 10) : 
        undefined;
      delete originalQuery.cache;
      delete originalQuery.cacheTTL;
    }

    // Add optimized query to request object
    (req as any).queryOptions = queryOptions;
    req.query = originalQuery;

    // Cache middleware
    if (queryOptions.cache) {
      const cacheKey = `${req.originalUrl}:${JSON.stringify(queryOptions)}`;
      const cachedData = await cache.get(cacheKey);

      if (cachedData) {
        return res.json(cachedData);
      }

      // Override response.json to cache the response
      const originalJson = res.json;
      res.json = function (data) {
        cache.set(cacheKey, data, queryOptions.cacheTTL);
        return originalJson.call(this, data);
      };
    }

    next();
  };
};

// Query builder helper
export const buildQuery = (queryOptions: QueryOptions) => {
  const query: any = {};

  if (queryOptions.fields) {
    query.attributes = queryOptions.fields;
  }

  if (queryOptions.includes) {
    query.include = queryOptions.includes;
  }

  if (queryOptions.page !== undefined && queryOptions.limit) {
    query.offset = (queryOptions.page - 1) * queryOptions.limit;
    query.limit = queryOptions.limit;
  }

  if (queryOptions.sort) {
    query.order = [[queryOptions.sort, queryOptions.order || 'ASC']];
  }

  return query;
};

// Index optimization middleware
export const indexOptimizer = (indexFields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const queryFields = Object.keys(req.query);
    const shouldAddIndex = queryFields.some(field => indexFields.includes(field));

    if (shouldAddIndex) {
      // Add hint to use index (implementation depends on your ORM/database)
      (req as any).useIndex = indexFields;
    }

    next();
  };
};
