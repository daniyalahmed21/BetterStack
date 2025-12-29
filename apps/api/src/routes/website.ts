import { Router } from "express";
import { prisma } from "@repo/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * CREATE WEBSITE
 * POST /websites
 */
router.post("/", requireAuth, async (req, res) => {
  const { url } = req.body;
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
        userId,
      },
    });

    res.sendStatus(201).json(website);
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
 * UPDATE WEBSITE
 * PUT /websites/:id
 */
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  const userId = req.userId;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const website = await prisma.website.updateMany({
      where: {
        id,
        userId,
      },
      data: {
        url,
      },
    });

    if (website.count === 0) {
      return res.status(404).json({ error: "Website not found" });
    }

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

    res.json({ success: true });
  } catch {
    res.status(404).json({ error: "Website not found" });
  }
});

export default router;
