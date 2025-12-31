import { Router } from "express";
import { prisma } from "@repo/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * LIST HEARTBEATS
 * GET /heartbeats
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const heartbeats = await prisma.heartbeat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(heartbeats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch heartbeats" });
  }
});

/**
 * CREATE HEARTBEAT
 * POST /heartbeats
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, period, grace } = req.body;
  const userId = req.userId;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const heartbeat = await prisma.heartbeat.create({
      data: {
        name,
        period: period || 300,
        grace: grace || 60,
        userId: userId!,
      },
    });
    res.status(201).json(heartbeat);
  } catch (err) {
    res.status(500).json({ error: "Failed to create heartbeat" });
  }
});

/**
 * UPDATE HEARTBEAT
 * PUT /heartbeats/:id
 */
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, period, grace } = req.body;
  const userId = req.userId;

  try {
    const heartbeat = await prisma.heartbeat.update({
      where: { id, userId },
      data: { name, period, grace },
    });
    res.json(heartbeat);
  } catch (err) {
    res.status(500).json({ error: "Failed to update heartbeat" });
  }
});

/**
 * DELETE HEARTBEAT
 * DELETE /heartbeats/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.heartbeat.delete({
      where: { id, userId },
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete heartbeat" });
  }
});

/**
 * PING HEARTBEAT
 * POST /heartbeats/:id/ping
 */
router.post("/:id/ping", async (req, res) => {
  const { id } = req.params;

  try {
    const heartbeat = await prisma.heartbeat.update({
      where: { id },
      data: {
        lastPingAt: new Date(),
        status: "Up",
      },
    });
    res.json(heartbeat);
  } catch (err) {
    res.status(500).json({ error: "Failed to ping heartbeat" });
  }
});

export default router;
