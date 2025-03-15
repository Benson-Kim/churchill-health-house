// lib/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

export async function cacheData<T>(
	key: string,
	data: T,
	ttl: number = 3600
): Promise<void> {
	await redis.setex(key, ttl, JSON.stringify(data));
}

export async function getCachedData<T>(key: string): Promise<T | null> {
	const data = await redis.get(key);
	return data ? JSON.parse(data) : null;
}

export async function invalidateCache(key: string): Promise<void> {
	await redis.del(key);
}

export default redis;
