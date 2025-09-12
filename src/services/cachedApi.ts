import { cache, withCache } from './cache';

/**
 * Cached API service for LastNext24
 * Provides caching wrapper for API calls to reduce server load and improve UX
 */

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class CachedApiService {
  private readonly baseUrl = '';
  private readonly DEFAULT_CACHE_TIME = 2 * 60 * 1000; // 2 minutes for API calls
  private readonly TRANSCRIPTION_CACHE_TIME = 10 * 60 * 1000; // 10 minutes for transcriptions
  private readonly CHAT_CACHE_TIME = 5 * 60 * 1000; // 5 minutes for chat responses

  /**
   * Generic API call with caching
   */
  private async apiCall<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheKey: string,
    cacheTTL: number = this.DEFAULT_CACHE_TIME
  ): Promise<T> {
    // Check cache first
    const cachedResponse = cache.get<T>(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Make API call
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Cache successful responses
    cache.set(cacheKey, data, cacheTTL);
    
    return data;
  }

  /**
   * Cached transcription service
   * Transcriptions are rarely repeated but when they are, caching saves significant time
   */
  async transcribeAudio(audioBlob: Blob): Promise<{ text: string; duration?: number }> {
    // Create cache key based on file size and type (simple hashing)
    const cacheKey = cache.constructor.createKey(
      'transcription', 
      audioBlob.size, 
      audioBlob.type,
      // Simple hash of first few bytes for uniqueness
      await this.getSimpleHash(audioBlob)
    );

    const cachedResult = cache.get<{ text: string; duration?: number }>(cacheKey);
    if (cachedResult) {
      console.log('Using cached transcription');
      return cachedResult;
    }

    // Make API call
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Transcription failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Cache transcription for longer since it's expensive
    cache.set(cacheKey, result, this.TRANSCRIPTION_CACHE_TIME);
    
    return result;
  }

  /**
   * Cached summarization service
   */
  async summarizeReports(
    reports: any[], 
    mode: 'individual' | 'aggregate' | 'executive' = 'individual'
  ): Promise<{ summary: string; tokens?: number }> {
    // Create cache key based on report content and mode
    const contentHash = await this.hashContent(JSON.stringify(reports));
    const cacheKey = cache.constructor.createKey('summarize', mode, contentHash);

    const cachedResult = cache.get<{ summary: string; tokens?: number }>(cacheKey);
    if (cachedResult) {
      console.log('Using cached summary');
      return cachedResult;
    }

    const response = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reports, mode })
    });

    if (!response.ok) {
      throw new Error(`Summarization failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Cache summaries for moderate time
    cache.set(cacheKey, result, this.DEFAULT_CACHE_TIME);
    
    return result;
  }

  /**
   * Cached chat service
   */
  async chatQuery(
    query: string, 
    context: any = {},
    selectedDate?: string
  ): Promise<{ response: string; sources?: any[] }> {
    const cacheKey = cache.constructor.createKey('chat', query, selectedDate, JSON.stringify(context));

    const cachedResult = cache.get<{ response: string; sources?: any[] }>(cacheKey);
    if (cachedResult) {
      console.log('Using cached chat response');
      return cachedResult;
    }

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query, 
        context, 
        selectedDate 
      })
    });

    if (!response.ok) {
      throw new Error(`Chat query failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Cache chat responses for shorter time since context may change
    cache.set(cacheKey, result, this.CHAT_CACHE_TIME);
    
    return result;
  }

  /**
   * Simple hash function for cache keys
   */
  private async getSimpleHash(blob: Blob): Promise<string> {
    const firstChunk = blob.slice(0, 1024); // First KB
    const buffer = await firstChunk.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Hash content for cache keys
   */
  private async hashContent(content: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Clear specific cache categories
   */
  clearTranscriptionCache(): void {
    const keysToDelete: string[] = [];
    for (const key of (cache as any).cache.keys()) {
      if (key.startsWith('transcription::')) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => cache.delete(key));
  }

  clearSummaryCache(): void {
    const keysToDelete: string[] = [];
    for (const key of (cache as any).cache.keys()) {
      if (key.startsWith('summarize::')) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => cache.delete(key));
  }

  clearChatCache(): void {
    const keysToDelete: string[] = [];
    for (const key of (cache as any).cache.keys()) {
      if (key.startsWith('chat::')) {
        keysToDelete.push(key);
      }
    }
    keysToDelete.forEach(key => cache.delete(key));
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return cache.getStats();
  }
}

// Create singleton instance
export const cachedApiService = new CachedApiService();
export default cachedApiService;