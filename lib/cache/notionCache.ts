// lib/cache/notionCache.ts
/**
 * 記憶體快取系統 - 加速開發環境
 */
class NotionCache {
  private cache: Map<string, { data: any; timestamp: number }>;
  private ttl: number; // Time To Live in milliseconds

  constructor(ttlMinutes: number = 5) {
    this.cache = new Map();
    this.ttl = ttlMinutes * 60 * 1000;
  }

  /**
   * 取得快取資料
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) return null;

    // 檢查是否過期
    const now = Date.now();
    if (now - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    console.log(`✨ Cache hit: ${key}`);
    return cached.data as T;
  }

  /**
   * 設定快取資料
   */
  set(key: string, data: any): void {
    console.log(`💾 Cache set: ${key}`);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * 清除特定快取
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Cache invalidated: ${key}`);
  }

  /**
   * 清除所有快取
   */
  clear(): void {
    this.cache.clear();
    console.log('🗑️ All cache cleared');
  }

  /**
   * 取得或設定快取（便利方法）
   */
  async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttlOverride?: number): Promise<T> {
    // 先檢查快取
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // 如果沒有快取，執行 fetcher
    console.log(`🔄 Fetching fresh data: ${key}`);
    const data = await fetcher();

    // 儲存到快取
    if (ttlOverride) {
      const originalTtl = this.ttl;
      this.ttl = ttlOverride;
      this.set(key, data);
      this.ttl = originalTtl;
    } else {
      this.set(key, data);
    }

    return data;
  }

  /**
   * 取得快取狀態
   */
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// 建立全域快取實例
export const notionCache = new NotionCache(
  process.env.NODE_ENV === 'development' ? 30 : 5, // 開發環境快取 30 分鐘
);

// 快取鍵值常數
export const CACHE_KEYS = {
  PERSONAL_INFO: 'personal_info',
  EXPERIENCES: 'experiences',
  EDUCATION: 'education',
  PROJECTS: 'projects',
  SKILLS: 'skills',
  PAGE_CONTENT: 'page_content',
  ALL_RESUME_DATA: 'all_resume_data',
} as const;

/**
 * 快取裝飾器（用於函數）
 */
export function withCache<T>(cacheKey: string, ttlMinutes?: number) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      return notionCache.getOrSet<T>(
        cacheKey,
        () => originalMethod.apply(this, args),
        ttlMinutes ? ttlMinutes * 60 * 1000 : undefined,
      );
    };

    return descriptor;
  };
}

/**
 * 批次快取預熱
 */
export async function warmCache(fetchers: Array<{ key: string; fetcher: () => Promise<any> }>): Promise<void> {
  console.log('🔥 Warming cache...');

  await Promise.all(fetchers.map(({ key, fetcher }) => notionCache.getOrSet(key, fetcher)));

  console.log('✅ Cache warmed successfully');
}

// 瀏覽器端快取（使用 localStorage）
export class BrowserCache {
  private prefix = 'notion_cache_';
  private ttl: number;

  constructor(ttlMinutes: number = 10) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);

      if (Date.now() - timestamp > this.ttl) {
        localStorage.removeItem(this.prefix + key);
        return null;
      }

      return data as T;
    } catch (error) {
      console.error('Browser cache read error:', error);
      return null;
    }
  }

  set(key: string, data: any): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(
        this.prefix + key,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error('Browser cache write error:', error);
      // 如果 localStorage 滿了，清除舊資料
      this.clearOldest();
    }
  }

  private clearOldest(): void {
    const items: Array<{ key: string; timestamp: number }> = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '{}');
          items.push({ key, timestamp: item.timestamp || 0 });
        } catch {}
      }
    }

    // 刪除最舊的 25% 項目
    items
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, Math.ceil(items.length * 0.25))
      .forEach(({ key }) => localStorage.removeItem(key));
  }

  clear(): void {
    if (typeof window === 'undefined') return;

    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
}

export const browserCache = new BrowserCache();
