import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redis.on("error", (err: Error) => {
  console.error("Redis error", err);
});

await redis.connect();
console.log("Redis connected");
