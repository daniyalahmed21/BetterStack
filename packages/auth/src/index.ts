import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@repo/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: "http://localhost:3001/api/auth",
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, 
  },
  trustedOrigins: [
    "http://localhost:3000", 
    "http://localhost:3000/", 
    "http://127.0.0.1:3000", 
    "http://127.0.0.1:3000/",
    "http://localhost:3001"
  ],
  // Allow requests without Origin header in development
  trustHost: true,
});
