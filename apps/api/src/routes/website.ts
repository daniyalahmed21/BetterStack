import { Router } from "express";
import { prisma } from "@repo/db";
import { requireAuth } from "../middlewares/auth";
import { emitToUser } from "../socket";

const router = Router();

/**
 * CREATE WEBSITE
 * POST /websites
 */
router.post("/", requireAuth, async (req, res) => {
  const { url, name, frequency, timeout, regionIds } = req.body;
  const userId = req.userId;

  if (!url) {
    return res.sendStatus(400).json({ error: "URL is required" });
  }

  if (!userId) {
    return res.sendStatus(401).json({ error: "Unauthorized" });
  }

  try {
    const website = await prisma.website.create({
      data: {
        url,
        name,
        userId,
        frequency: frequency || 60,
        timeout: timeout || 30,
        regions: regionIds ? {
          connect: regionIds.map((id: string) => ({ id }))
        } : undefined,
      },
      include: {
        regions: true
      }
    });

    emitToUser(userId, "website.updated", website);
    res.status(201).json(website);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Website already exists" });
    }
    res.status(500).json({ error: "Failed to create website" });
  }
});

/**
 * LIST WEBSITES
 * GET /websites
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.userId;

  const websites = await prisma.website.findMany({
    where: { userId },
    include: { regions: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(websites);
});

/**
 * GET SINGLE WEBSITE
 * GET /websites/:id
 */
router.get("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const website = await prisma.website.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      ticks: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!website) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json(website);
});

/**
 * GET WEBSITE TICKS
 * GET /websites/:id/ticks
 */
router.get("/:id/ticks", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const ticks = await prisma.websiteTick.findMany({
    where: {
      websiteId: id,
      website: {
        userId,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  res.json(ticks);
});

/**
 * UPDATE WEBSITE
 * PUT /websites/:id
 */
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { url, name, frequency, timeout, regionIds } = req.body;
  const userId = req.userId;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const website = await prisma.website.update({
      where: {
        id,
        userId,
      },
      data: {
        url,
        name,
        frequency,
        timeout,
        regions: regionIds ? {
          set: regionIds.map((id: string) => ({ id }))
        } : undefined,
      },
    });

    emitToUser(userId!, "website.updated", { id });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to update website" });
  }
});

/**
 * DELETE WEBSITE
 * DELETE /websites/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.website.delete({
      where: {
        id,
        userId,
      },
    });

    emitToUser(userId!, "website.updated", { id, deleted: true });
    res.json({ success: true });
  } catch {
    res.status(404).json({ error: "Website not found" });
  }
});

/**
 * GET WEBSITE ANALYTICS
 * GET /websites/:id/analytics
 */
router.get("/:id/analytics", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  const periods = [7, 30, 90];
  const analytics: Record<string, any> = {};

  try {
    for (const days of periods) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const ticks = await prisma.websiteTick.findMany({
        where: {
          websiteId: id,
          website: { userId },
          createdAt: { gte: startDate },
        },
      });

      const totalTicks = ticks.length;
      const upTicks = ticks.filter((t) => t.status === "Up").length;
      const uptime = totalTicks > 0 ? (upTicks / totalTicks) * 100 : 100;

      const avgResponseTime =
        totalTicks > 0
          ? ticks.reduce((acc, t) => acc + t.responseTimeMs, 0) / totalTicks
          : 0;

      analytics[`last${days}Days`] = {
        uptime: parseFloat(uptime.toFixed(2)),
        avgResponseTime: Math.round(avgResponseTime),
      };
    }

    res.json(analytics);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

/**
 * LIST REGIONS
 * GET /regions
 */
router.get("/regions/list", async (req, res) => {
  try {
    const regions = await prisma.region.findMany();
    res.json(regions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch regions" });
  }
});

export default router;
