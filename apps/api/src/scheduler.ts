import cron from "node-cron";
import { produceUptimeJobs } from "./jobs/uptimeProducer";

export function startScheduler() {
  // every 1 minute
  cron.schedule("* * * * *", async () => {
    await produceUptimeJobs();
  });
}
