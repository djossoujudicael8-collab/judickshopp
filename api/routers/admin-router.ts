import { z } from "zod";
import { createRouter, publicQuery } from "../middleware.js";
import { getDb } from "../queries/connection.js";
import { adminUsers } from "../../db/schema.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "judickshop-admin-secret-key-2025";

export const adminRouter = createRouter({
  login: publicQuery
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(adminUsers)
        .where(eq(adminUsers.email, input.email))
        .limit(1);

      const admin = result[0];
      if (!admin) {
        throw new Error("Invalid credentials");
      }

      const isValid = await bcrypt.compare(input.password, admin.passwordHash);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      return { token, email: admin.email };
    }),

  me: publicQuery.query(async ({ ctx }) => {
    const authHeader = ctx.req.headers.get("x-admin-token");
    if (!authHeader) {
      return null;
    }

    try {
      const decoded = jwt.verify(authHeader, JWT_SECRET) as { id: number; email: string };
      return { id: decoded.id, email: decoded.email };
    } catch {
      return null;
    }
  }),
});