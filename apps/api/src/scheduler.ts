import cron from "node-cron";
import { produceUptimeJobs } from "./jobs/uptimeProducer";
import { checkHeartbeats } from "./jobs/heartbeatChecker";

export function startScheduler() {
  // every 1 minute
  cron.schedule("* * * * *", async () => {
    await produceUptimeJobs();
    await checkHeartbeats();
  });
}
