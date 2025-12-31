import { Router } from "express";
import { prisma } from "@repo/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * LIST ALERT CHANNELS
 * GET /alert-channels
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const channels = await prisma.alertChannel.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alert channels" });
  }
});

/**
 * CREATE ALERT CHANNEL
 * POST /alert-channels
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, type, target } = req.body;
  const userId = req.userId;

  if (!name || !type || !target) {
    return res.status(400).json({ error: "Name, type, and target are required" });
  }

  try {
    const channel = await prisma.alertChannel.create({
      data: {
        name,
        type,
        target,
        userId: userId!,
      },
    });
    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to create alert channel" });
  }
});

/**
 * UPDATE ALERT CHANNEL
 * PUT /alert-channels/:id
 */
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, type, target, active } = req.body;
  const userId = req.userId;

  try {
    const channel = await prisma.alertChannel.update({
      where: { id, userId },
      data: { name, type, target, active },
    });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: "Failed to update alert channel" });
  }
});

/**
 * DELETE ALERT CHANNEL
 * DELETE /alert-channels/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.alertChannel.delete({
      where: { id, userId },
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete alert channel" });
  }
});

export default router;
