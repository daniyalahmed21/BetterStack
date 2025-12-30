import { prisma } from "@repo/db";
import { WebsiteStatus } from "@repo/db";

export async function evaluateWebsiteStatus(websiteId: string) {
  // 1️⃣ Fetch last 3 ticks
  const ticks = await prisma.websiteTick.findMany({
    where: { websiteId },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  if (ticks.length === 0) return;

  let newStatus: WebsiteStatus = "Unknown";

  const allDown = ticks.length === 3 && ticks.every(t => t.status === "Down");
  const lastUp = ticks[0]?.status === "Up";

  if (allDown) newStatus = "Down";
  else if (lastUp) newStatus = "Up";

  // 2️⃣ Get current website status
  const website = await prisma.website.findUnique({
    where: { id: websiteId },
    select: { status: true },
  });

  if (!website) return;

  // 3️⃣ Only update if status changed
  if (website.status !== newStatus) {
    await prisma.website.update({
      where: { id: websiteId },
      data: {
        status: newStatus,
        lastCheckedAt: new Date(),
      },
    });

    // 4️⃣ Trigger alert (later)
    console.log(
      `[ALERT] Website ${websiteId} changed from ${website.status} → ${newStatus}`
    );
  }
}
