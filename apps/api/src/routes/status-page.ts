import { Router } from "express";
import { prisma } from "@repo/db";
import { requireAuth } from "../middlewares/auth";

const router = Router();

/**
 * LIST STATUS PAGES
 * GET /status-pages
 */
router.get("/", requireAuth, async (req, res) => {
  const userId = req.userId;

  try {
    const statusPages = await prisma.statusPage.findMany({
      where: { userId },
      include: { websites: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(statusPages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch status pages" });
  }
});

/**
 * CREATE STATUS PAGE
 * POST /status-pages
 */
router.post("/", requireAuth, async (req, res) => {
  const { name, slug, websiteIds } = req.body;
  const userId = req.userId;

  if (!name || !slug) {
    return res.status(400).json({ error: "Name and slug are required" });
  }

  try {
    const statusPage = await prisma.statusPage.create({
      data: {
        name,
        slug,
        userId: userId!,
        websites: {
          connect: websiteIds?.map((id: string) => ({ id })) || [],
        },
      },
      include: { websites: true },
    });
    res.status(201).json(statusPage);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Slug already exists" });
    }
    res.status(500).json({ error: "Failed to create status page" });
  }
});

/**
 * UPDATE STATUS PAGE
 * PUT /status-pages/:id
 */
router.put("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { name, slug, websiteIds, status } = req.body;
  const userId = req.userId;

  try {
    const statusPage = await prisma.statusPage.update({
      where: { id, userId },
      data: {
        name,
        slug,
        status,
        websites: websiteIds
          ? {
              set: websiteIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: { websites: true },
    });
    res.json(statusPage);
  } catch (err) {
    res.status(500).json({ error: "Failed to update status page" });
  }
});

/**
 * DELETE STATUS PAGE
 * DELETE /status-pages/:id
 */
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;

  try {
    await prisma.statusPage.delete({
      where: { id, userId },
    });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete status page" });
  }
});

/**
 * PUBLIC STATUS PAGE
 * GET /status-pages/public/:slug
 */
router.get("/public/:slug", async (req, res) => {
  const { slug } = req.params;

  try {
    const statusPage = await prisma.statusPage.findUnique({
      where: { slug, status: "Published" },
      include: {
        websites: {
          select: {
            id: true,
            name: true,
            url: true,
            status: true,
            lastCheckedAt: true,
          },
        },
      },
    });

    if (!statusPage) {
      return res.status(404).json({ error: "Status page not found" });
    }

    res.json(statusPage);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch public status page" });
  }
});

export default router;
