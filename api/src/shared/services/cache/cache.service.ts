import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

interface MemoryEntry {
  value: string;
  expiresAt: number;
}

const MAX_MEMORY_ENTRIES = 1000;

/**
 * Small JSON cache. Uses Redis when `REDIS_URL` is configured and reachable, and an in-process
 * TTL map otherwise (or whenever Redis errors), so the API works without Redis.
 */
@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private readonly memory = new Map<string, MemoryEntry>();
  private readonly redis: Redis | null = null;

  constructor(config: ConfigService) {
    const redisUrl = config.get<string>('REDIS_URL');
    if (redisUrl) {
      this.redis = new Redis(redisUrl, {
        lazyConnect: false,
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
      });
      this.redis.on('error', (error) =>
        this.logger.warn(`Redis cache error: ${error.message}`),
      );
    } else {
      this.logger.log('REDIS_URL not set — using in-memory cache');
    }
  }

  async get<T>(key: string): Promise<T | undefined> {
    const raw = await this.getRaw(key);
    return raw === undefined ? undefined : (JSON.parse(raw) as T);
  }

  async set<T>(key: string, value: T, ttlMs: number): Promise<void> {
    const raw = JSON.stringify(value);
    if (this.redis?.status === 'ready') {
      try {
        await this.redis.set(key, raw, 'PX', ttlMs);
        return;
      } catch (error) {
        this.logger.warn(
          `Redis set failed, using memory: ${(error as Error).message}`,
        );
      }
    }
    if (this.memory.size >= MAX_MEMORY_ENTRIES) this.evictExpired(true);
    this.memory.set(key, { value: raw, expiresAt: Date.now() + ttlMs });
  }

  async delete(key: string): Promise<void> {
    this.memory.delete(key);
    if (this.redis?.status === 'ready') {
      try {
        await this.redis.del(key);
      } catch {
        // ignore — memory entry already removed
      }
    }
  }

  async onModuleDestroy() {
    if (this.redis) this.redis.disconnect();
  }

  private async getRaw(key: string): Promise<string | undefined> {
    if (this.redis?.status === 'ready') {
      try {
        const value = await this.redis.get(key);
        if (value !== null) return value;
      } catch (error) {
        this.logger.warn(
          `Redis get failed, using memory: ${(error as Error).message}`,
        );
      }
    }
    const entry = this.memory.get(key);
    if (!entry) return undefined;
    if (entry.expiresAt <= Date.now()) {
      this.memory.delete(key);
      return undefined;
    }
    return entry.value;
  }

  private evictExpired(force: boolean) {
    const now = Date.now();
    for (const [key, entry] of this.memory) {
      if (entry.expiresAt <= now) this.memory.delete(key);
    }
    if (force && this.memory.size >= MAX_MEMORY_ENTRIES) {
      const oldest = this.memory.keys().next().value;
      if (oldest !== undefined) this.memory.delete(oldest);
    }
  }
}
