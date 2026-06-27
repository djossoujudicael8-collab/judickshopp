import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { blogPosts } from "@db/schema";
import { eq, desc, sql } from "drizzle-orm";

export const blogRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(9),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { page, limit } = input ?? { page: 1, limit: 9 };
      const offset = (page - 1) * limit;

      const items = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.createdAt))
        .limit(limit)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(blogPosts);

      const total = countResult[0]?.count ?? 0;

      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.id, input.id))
        .limit(1);

      return result[0] ?? null;
    }),

  getRelated: publicQuery
    .input(z.object({ id: z.number(), category: z.string().optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [sql`${blogPosts.id} != ${input.id}`];
      
      if (input.category) {
        conditions.push(eq(blogPosts.category, input.category));
      }

      const result = await db
        .select()
        .from(blogPosts)
        .where(sql`${conditions.join(" AND ")}`)
        .orderBy(desc(blogPosts.createdAt))
        .limit(3);

      return result;
    }),

  create: publicQuery
    .input(
      z.object({
        title: z.string().min(2),
        content: z.string().min(10),
        coverImage: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(blogPosts).values({
        title: input.title,
        content: input.content,
        coverImage: input.coverImage,
        category: input.category,
      });
      return result;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(2).optional(),
        content: z.string().min(10).optional(),
        coverImage: z.string().optional(),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));
      return { success: true };
    }),
});
