import express, { type Request, type Response } from "express";
import cors from "cors";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "@repo/auth";
import websiteRoutes from "./routes/website";
import incidentRoutes from "./routes/incident";
import { startScheduler } from "./scheduler";

const app = express();
const port = process.env.PORT || 3001;

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

startScheduler();


app.get("/api/auth/ok", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
  console.log(`Test auth at http://localhost:${port}/api/auth/ok`);
});
