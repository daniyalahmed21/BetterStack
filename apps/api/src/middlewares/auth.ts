import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "@repo/auth";
import { prisma } from "@repo/db";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session?.user?.id) {
      req.userId = session.user.id;
      req.session = session;
      return next();
    }

    // Fallback for development: use the first user if no session
    if (process.env.NODE_ENV !== "production") {
      const firstUser = await prisma.user.findFirst();
      if (firstUser) {
        req.userId = firstUser.id;
        // @ts-ignore
        req.session = { user: firstUser };
        return next();
      }
    }

    return res.status(401).json({ error: "Unauthorized" });
    
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
