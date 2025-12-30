import { prisma, WebsiteStatus } from "@repo/db";

export async function evaluateWebsiteStatus(
  websiteId: string,
  previousStatus?: WebsiteStatus
) {
  const ticks = await prisma.websiteTick.findMany({
    where: { websiteId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (ticks.length < 3) return;

  const allDown = ticks.every(t => t.status === "Down");

  const lastTwoUp =
    ticks[0]?.status === "Up" &&
    ticks[1]?.status === "Up";

  let newStatus: WebsiteStatus | null = null;

  if (allDown) newStatus = "Down";
  else if (lastTwoUp) newStatus = "Up";

  if (!newStatus) return;
  if (!previousStatus || previousStatus === newStatus) return;

  if (newStatus === "Down") {
    const openIncident = await prisma.incident.findFirst({
      where: { websiteId, status: "Open" },
    });

    if (!openIncident) {
      await prisma.incident.create({
        data: {
          websiteId,
          startedAt: new Date(),
          status: "Open",
        },
      });
    }
  }

  if (newStatus === "Up") {
    await prisma.incident.updateMany({
      where: { websiteId, status: "Open" },
      data: {
        status: "Closed",
        endedAt: new Date(),
      },
    });
  }

  await prisma.website.update({
    where: { id: websiteId },
    data: {
      status: newStatus,
      lastCheckedAt: new Date(),
    },
  });

  console.log(
    `[STATUS] ${websiteId}: ${previousStatus} → ${newStatus}`
  );
}
