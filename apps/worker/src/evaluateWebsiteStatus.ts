import { prisma, WebsiteStatus } from "@repo/db";

export async function evaluateMultiRegionStatus(websiteId: string) {
  const ticks = await prisma.websiteTick.findMany({
    where: { websiteId },
    orderBy: { createdAt: "desc" },
    distinct: ["regionId"], // last tick per region
  });

  if (!ticks.length) return;

  const downRegions = ticks.filter(t => t.status === "Down").length;
  const upRegions = ticks.filter(t => t.status === "Up").length;

  let newStatus: WebsiteStatus = upRegions >= downRegions ? "Up" : "Down";

  const website = await prisma.website.findUnique({ where: { id: websiteId } });
  if (!website || website.status === newStatus) return;

  // 1 Update website
  await prisma.website.update({
    where: { id: websiteId },
    data: { status: newStatus, lastCheckedAt: new Date() },
  });

  // 2 Incident windows
  if (newStatus === "Down") {
    // Open incident if none exists
    const openIncident = await prisma.incident.findFirst({
      where: { websiteId, status: "Open" },
    });
    if (!openIncident) {
      await prisma.incident.create({
        data: { websiteId, status: "Open", startedAt: new Date() },
      });
    }
  } else if (newStatus === "Up") {
    // Close open incidents
    await prisma.incident.updateMany({
      where: { websiteId, status: "Open" },
      data: { status: "Closed", endedAt: new Date() },
    });
  }

  // 3 Alert dedupe: only log if status changed
  console.log(`[ALERT] ${websiteId} status: ${website.status} → ${newStatus}`);
}
