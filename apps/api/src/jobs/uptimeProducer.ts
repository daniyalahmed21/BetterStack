import { prisma } from "@repo/db";
import { redis } from "../redis";

const STREAM = "uptime:jobs";

export async function produceUptimeJobs() {
  const websites = await prisma.website.findMany({
    select: {
      id: true,
      url: true
    }
  });

  for (const site of websites) {
    await redis.xAdd(
      STREAM,
      "*",
      {
        websiteId: site.id,
        url: site.url
      }
    );
  }

  console.log(`Queued ${websites.length} uptime jobs`);
}
