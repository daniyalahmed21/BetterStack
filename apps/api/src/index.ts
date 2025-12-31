import express, { type Request, type Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { toNodeHandler } from "better-auth/node";
import { auth } from "@repo/auth";
import websiteRoutes from "./routes/website";
import incidentRoutes from "./routes/incident";
import heartbeatRoutes from "./routes/heartbeat";
import statusPageRoutes from "./routes/status-page";
import alertChannelRoutes from "./routes/alert-channel";
import { startScheduler } from "./scheduler";
import { initSocket } from "./socket";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3001;

initSocket(server);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/websites", websiteRoutes);
app.use("/incidents", incidentRoutes);
app.use("/heartbeats", heartbeatRoutes);
app.use("/status-pages", statusPageRoutes);
app.use("/alert-channels", alertChannelRoutes);

app.get("/api/auth/ok", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

startScheduler();

server.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  console.log(`Test auth at http://localhost:${port}/api/auth/ok`);
});
