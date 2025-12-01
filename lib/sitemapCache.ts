// lib/sitemapCache.ts
interface CacheEntry {
  data: string;
  timestamp: number;
  expiresAt: number;
}

class SitemapCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 3600; // 1 hour

  set(key: string, data: string, ttl: number = this.DEFAULT_TTL) {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (ttl * 1000)
    });
  }

  get(key: string): string | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  clear() {
    this.cache.clear();
  }

  // For Redis in production
  async setRedis(key: string, data: string, ttl: number = this.DEFAULT_TTL) {
    // Implementation for Redis caching
    // await redis.setex(key, ttl, data);
  }

  async getRedis(key: string): Promise<string | null> {
    // Implementation for Redis caching
    // return await redis.get(key);
    return null;
  }
}

export const sitemapCache = new SitemapCache();