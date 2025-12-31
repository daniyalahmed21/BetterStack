import { prisma } from "@repo/db";

export async function sendAlertOnce(
  incidentId: string,
  type: "IncidentStarted" | "IncidentResolved",
  sendFn: () => Promise<void>
) {
  try {
    await prisma.alert.create({
      data: {
        incidentId,
        type,
      },
    });

    // If insert succeeds → alert was NOT sent before
    await sendFn();

  } catch (err: any) {
    // Unique constraint violation = already sent
    if (err.code === "P2002") {
      return;
    }
    throw err;
  }
}
