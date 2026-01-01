import { prisma } from "@repo/db";
import { sendEmail, getAlertHtml } from "@repo/mail";

export async function checkHeartbeats() {
  const now = new Date();
  
  const heartbeats = await prisma.heartbeat.findMany({
    where: {
      status: { not: "Down" },
    },
    include: {
      user: {
        include: {
          alertChannels: {
            where: { type: "Email", active: true }
          }
        }
      }
    }
  });

  for (const hb of heartbeats) {
    if (!hb.lastPingAt) continue;

    const deadline = new Date(hb.lastPingAt.getTime() + (hb.period + hb.grace) * 1000);
    
    if (now > deadline) {
      console.log(`[HEARTBEAT] Heartbeat DOWN: ${hb.name} (${hb.id})`);
      
      await prisma.heartbeat.update({
        where: { id: hb.id },
        data: { status: "Down" },
      });

      // Send email alerts
      if (hb.user.alertChannels) {
        for (const channel of hb.user.alertChannels) {
          await sendEmail(
            channel.target,
            `Heartbeat Missed: ${hb.name}`,
            `Your heartbeat "${hb.name}" has missed its expected ping.\n\nLast ping: ${hb.lastPingAt.toLocaleString()}\nDeadline: ${deadline.toLocaleString()}`,
            getAlertHtml(
              "Heartbeat Missed",
              `Your heartbeat "${hb.name}" has missed its expected ping. Last ping was at ${hb.lastPingAt.toLocaleString()}.`
            )
          );
        }
      }
    }
  }
}
