/**
 * Simple caching service for API responses and data
 * Uses memory-based storage with TTL (Time To Live) support
 */

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheService {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default

  /**
   * Store data in cache with optional TTL
   */
  set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    this.cache.set(key, entry);

    // Clean up expired entries periodically
    if (this.cache.size > 100) {
      this.cleanup();
    }
  }

  /**
   * Get data from cache if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Check if key exists in cache and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove specific key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Remove expired entries from cache
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.cache.values()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries
    };
  }

  /**
   * Create a cache key from multiple parts
   */
  static createKey(...parts: (string | number | boolean | null | undefined)[]): string {
    return parts
      .filter(part => part !== null && part !== undefined)
      .map(part => String(part))
      .join('::');
  }
}

// Create a global cache instance
export const cache = new CacheService();

/**
 * Cache decorator for async functions
 * Usage: const cachedFn = withCache(originalFn, 'cache-key', 300000); // 5min cache
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyPrefix: string,
  ttl: number = 5 * 60 * 1000
): T {
  return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    // Create cache key from function arguments
    const cacheKey = CacheService.createKey(keyPrefix, ...args);

    // Try to get from cache first
    const cachedResult = cache.get(cacheKey);
    if (cachedResult !== null) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cachedResult as Awaited<ReturnType<T>>;
    }

    // Execute function and cache result
    try {
      console.log(`Cache miss for key: ${cacheKey} - executing function`);
      const result = await fn(...args);
      cache.set(cacheKey, result, ttl);
      return result;
    } catch (error) {
      // Don't cache errors, let them propagate
      throw error;
    }
  }) as T;
}

/**
 * React hook for cached API calls
 */
export function useCachedFunction<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyPrefix: string,
  ttl: number = 5 * 60 * 1000
) {
  const cachedFn = withCache(fn, keyPrefix, ttl);
  
  return {
    execute: cachedFn,
    invalidate: (...args: Parameters<T>) => {
      const cacheKey = CacheService.createKey(keyPrefix, ...args);
      cache.delete(cacheKey);
    },
    clear: () => {
      // Clear all keys that start with this prefix
      const keysToDelete: string[] = [];
      for (const key of (cache as any).cache.keys()) {
        if (key.startsWith(keyPrefix)) {
          keysToDelete.push(key);
        }
      }
      keysToDelete.forEach(key => cache.delete(key));
    }
  };
}

// Export cache utilities
export { CacheService };
export default cache;