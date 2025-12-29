import { createClient } from "redis";

export const redis = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

await redis.set("key", "value");
const value = await redis.get("key");
redis.destroy();