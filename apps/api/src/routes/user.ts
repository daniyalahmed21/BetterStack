import { Router } from "express";
import { requireAuth } from "../middlewares/auth";
import { prisma } from "@repo/databases";

const router = Router();

// Get current user
router.get("/me", requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update current user
router.patch("/me", requireAuth, async (req, res) => {
  try {
    const { name, image } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        name,
        image,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    res.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export { router as userRouter };
