import { prisma, WebsiteStatus } from "@repo/db";
import { sendAlertOnce } from "./sendAlertOnce";
import { sendEmail, getAlertHtml } from "./services/email";

export async function evaluateMultiRegionStatus(websiteId: string) {
  const ticks = await prisma.websiteTick.findMany({
    where: { websiteId },
    orderBy: { createdAt: "desc" },
    distinct: ["regionId"], // last tick per region
  });

  if (!ticks.length) return;

  const downRegions = ticks.filter((t) => t.status === "Down").length;
  const upRegions = ticks.filter((t) => t.status === "Up").length;

  let newStatus: WebsiteStatus = upRegions >= downRegions ? "Up" : "Down";

  const website = await prisma.website.findUnique({ where: { id: websiteId } });
  if (!website || website.status === newStatus) return;

  // 1 Update website
  await prisma.website.update({
    where: { id: websiteId },
    data: { status: newStatus, lastCheckedAt: new Date() },
  });

  if (newStatus === "Down") {
    const openIncident = await prisma.incident.findFirst({
      where: { websiteId, status: "Open" },
    });

    if (!openIncident) {
      const incident = await prisma.incident.create({
        data: {
          websiteId,
          startedAt: new Date(),
          status: "Open",
        },
      });

      await sendAlertOnce(incident.id, "IncidentStarted", async () => {
        console.log(`[ALERT] Website DOWN: ${websiteId}`);
        
        // Fetch User and Alert Channels
        const websiteWithOwner = await prisma.website.findUnique({
          where: { id: websiteId },
          include: { user: { include: { alertChannels: { where: { type: "Email", active: true } } } } }
        });

        if (websiteWithOwner?.user.alertChannels) {
          for (const channel of websiteWithOwner.user.alertChannels) {
            await sendEmail(
              channel.target,
              `Incident Started: ${websiteWithOwner.name || websiteWithOwner.url}`,
              `Your website ${websiteWithOwner.url} is DOWN.\n\nIncident started at: ${new Date().toLocaleString()}`,
              getAlertHtml(
                "Incident Started",
                `Your website is DOWN. Incident started at: ${new Date().toLocaleString()}`,
                websiteWithOwner.url
              )
            );
          }
        }
      });
    }
  }
  if (newStatus === "Up") {
    const openIncidents = await prisma.incident.findMany({
      where: { websiteId, status: "Open" },
    });

    for (const incident of openIncidents) {
      await prisma.incident.update({
        where: { id: incident.id },
        data: {
          status: "Closed",
          endedAt: new Date(),
        },
      });

      await sendAlertOnce(incident.id, "IncidentResolved", async () => {
        console.log(`[ALERT] Website UP: ${websiteId}`);
        
        const websiteWithOwner = await prisma.website.findUnique({
          where: { id: websiteId },
          include: { user: { include: { alertChannels: { where: { type: "Email", active: true } } } } }
        });

        if (websiteWithOwner?.user.alertChannels) {
          for (const channel of websiteWithOwner.user.alertChannels) {
            await sendEmail(
              channel.target,
              `Incident Resolved: ${websiteWithOwner.name || websiteWithOwner.url}`,
              `Your website ${websiteWithOwner.url} is back UP.\n\nIncident resolved at: ${new Date().toLocaleString()}`,
              getAlertHtml(
                "Incident Resolved",
                `Your website is back UP. Incident resolved at: ${new Date().toLocaleString()}`,
                websiteWithOwner.url
              )
            );
          }
        }
      });
    }
  }

  // 3 Alert dedupe: only log if status changed
  console.log(`[ALERT] ${websiteId} status: ${website.status} → ${newStatus}`);
}
