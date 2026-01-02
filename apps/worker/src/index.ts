import axios from "axios";
import { createClient } from "redis";
import { prisma, WebsiteStatus } from "@repo/db";
import { evaluateMultiRegionStatus } from "./evaluateWebsiteStatus";

const REGION_ID = process.env.REGION_ID || "default-region";
const WORKER_ID = `worker-${process.pid}`;
const STREAM = "uptime:jobs";
const GROUP = "uptime-group";

const redis = await createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
}).connect();

console.log(`[${WORKER_ID}] Redis connected`);

// Ensure consumer group
try {
  await redis.xGroupCreate(STREAM, GROUP, "$", { MKSTREAM: true });
} catch (err: any) {
  if (!err.message.includes("BUSYGROUP")) console.error(err);
}

async function fetchWebsite(url: string, websiteId: string) {
  const start = Date.now();
  let status: WebsiteStatus = "Unknown";

  // First, verify the website exists
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
  });

  if (!website) {
    console.log(`[SKIP] Website ${websiteId} not found, skipping check`);
    return;
  }

  try {
    await axios.get(url, { timeout: 10000 });
    status = "Up";
  } catch {
    status = "Down";
  }

  const responseTime = Date.now() - start;

  // Save tick
  try {
    await prisma.websiteTick.create({
      data: { websiteId, regionId: REGION_ID, responseTimeMs: responseTime, status },
    });

    // Evaluate multi-region status after each tick
    await evaluateMultiRegionStatus(websiteId);
  } catch (error: any) {
    console.error(`[ERROR] Failed to save tick for ${websiteId}:`, error.message);
  }
}

async function main() {
  // Ensure region exists
  try {
    await prisma.region.upsert({
      where: { name: REGION_ID },
      update: {},
      create: {
        id: REGION_ID,
        name: REGION_ID,
      },
    });
    console.log(`[${WORKER_ID}] Region "${REGION_ID}" verified/created`);
  } catch (error) {
    console.error(`[ERROR] Failed to ensure region "${REGION_ID}":`, error);
  }

  while (true) {
    try {
      const response: any = await redis.xReadGroup(
        GROUP,
        WORKER_ID,
        { key: STREAM, id: ">" },
        { COUNT: 10, BLOCK: 5000 }
      );

      if (!response?.length) continue;

      const messages = response[0].messages || [];

      await Promise.all(
        messages.map(({ id, message }: any) => fetchWebsite(message.url, message.websiteId))
      );

      // Acknowledge processed jobs
      for (const { id } of messages) {
        await redis.xAck(STREAM, GROUP, id);
      }
    } catch (err) {
      console.error(err);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main();
