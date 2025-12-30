import axios from "axios";
import { createClient } from "redis";
import { prisma } from "@repo/db";
import { evaluateWebsiteStatus } from "./evaluateWebsiteStatus";

const REGION_ID = process.env.REGION_ID || "default-region";
const WORKER_ID = process.env.WORKER_ID || `worker-${process.pid}`;
const STREAM = "uptime:jobs";
const GROUP = "uptime-group";

if (!REGION_ID) {
  throw new Error("REGION_ID environment variable is required");
}

const redis = await createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
})
  .on("error", (err) => console.error("[Redis] Error:", err))
  .connect();

console.log(`[${WORKER_ID}] Redis connected`);

// Ensure consumer group exists
try {
  await redis.xGroupCreate(STREAM, GROUP, "$", {
    MKSTREAM: true,
  });
  console.log(`[${WORKER_ID}] Consumer group created`);
} catch (err: any) {
  if (!err.message?.includes("BUSYGROUP")) {
    console.error("[Consumer Group] Error:", err);
  }
}

type MessageType = {
  id: string;
  message: {
    websiteId: string;
    url: string;
  };
};

async function fetchWebsite(url: string, websiteId: string): Promise<void> {
  const startTime = Date.now();
  let tickStatus: "Up" | "Down";

  try {
    await axios.get(url, { timeout: 10000 });
    tickStatus = "Up";
  } catch {
    tickStatus = "Down";
  }

  const responseTime = Date.now() - startTime;

  await prisma.websiteTick.create({
    data: {
      responseTimeMs: responseTime,
      status: tickStatus,
      regionId: REGION_ID,
      websiteId,
    },
  });

  // Get current website status
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    select: { status: true },
  });

  // Evaluate only when needed
  if (
    tickStatus === "Down" ||
    (tickStatus === "Up" && website?.status === "Down")
  ) {
    await evaluateWebsiteStatus(websiteId);
  }
}


async function main() {
  console.log(`[${WORKER_ID}] Waiting for jobs in region ${REGION_ID}...`);

  while (true) {
    try {
      // Read from stream using the exact API from your example
      const response = (await redis.xReadGroup(
        GROUP,
        WORKER_ID,
        {
          key: STREAM,
          id: ">",
        },
        {
          COUNT: 10,
          BLOCK: 5000,
        }
      )) as any;

      if (!response || response.length === 0) {
        continue;
      }

      // Debug: Log the actual response structure
      console.log(`[${WORKER_ID}] Response:`, JSON.stringify(response, null, 2).substring(0, 500));

      // The response format is: [{ key: STREAM, messages: [{ id, message: {} }] }]
      const streamData = response[0];
      const messages = streamData?.messages || [];

      if (!messages || messages.length === 0) {
        console.log(`[${WORKER_ID}] No messages in response`);
        continue;
      }

      console.log(`[${WORKER_ID}] Processing ${messages.length} jobs...`);

      // Process all jobs in parallel
      const promises = messages.map(({ message, id }: any) => {
        const url = message?.url;
        const websiteId = message?.websiteId;
        
        console.log(
          `[${WORKER_ID}] Job ${id}: checking ${url} (websiteId: ${websiteId})`
        );
        return fetchWebsite(url, websiteId);
      });

      await Promise.all(promises);

      // Acknowledge all jobs
      const jobIds = messages.map(({ id }: any) => id);
      for (const jobId of jobIds) {
        await redis.xAck(STREAM, GROUP, jobId);
      }

      console.log(`[${WORKER_ID}] ✓ Acknowledged ${jobIds.length} jobs`);
    } catch (err) {
      console.error(
        `[${WORKER_ID}] Error:`,
        err instanceof Error ? err.message : err
      );
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});