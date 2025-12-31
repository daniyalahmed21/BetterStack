import { Router } from "express";
import { prisma } from "@repo/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * LIST INCIDENTS
 * GET /incidents
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        website: {
          userId,
        },
      },
      include: {
        website: {
          select: {
            name: true,
            url: true,
          },
        },
      },
      orderBy: { startedAt: "desc" },
    });

    res.json(incidents);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch incidents" });
  }
});

export default router;
