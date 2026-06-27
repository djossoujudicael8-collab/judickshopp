import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { products, categories } from "@db/schema";
import { eq, like, desc, asc, and, sql } from "drizzle-orm";

export const productRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        categoryId: z.number().optional(),
        search: z.string().optional(),
        sort: z.enum(["recent", "price_asc", "price_desc"]).default("recent"),
        page: z.number().default(1),
        limit: z.number().default(12),
      }).optional()
    )
    .query(async ({ input }) => {
      const db = getDb();
      const { categoryId, search, sort, page, limit } = input ?? {};
      const offset = ((page ?? 1) - 1) * (limit ?? 12);

      const conditions = [];
      if (categoryId) {
        conditions.push(eq(products.categoryId, categoryId));
      }
      if (search) {
        conditions.push(like(products.name, `%${search}%`));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      let orderBy;
      switch (sort) {
        case "price_asc":
          orderBy = asc(products.price);
          break;
        case "price_desc":
          orderBy = desc(products.price);
          break;
        default:
          orderBy = desc(products.createdAt);
      }

      const items = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          categoryId: products.categoryId,
          images: products.images,
          sku: products.sku,
          createdAt: products.createdAt,
          categoryName: categories.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(where)
        .orderBy(orderBy)
        .limit(limit ?? 12)
        .offset(offset);

      const countResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(where);

      const total = countResult[0]?.count ?? 0;

      return {
        items,
        total,
        page: page ?? 1,
        totalPages: Math.ceil(total / (limit ?? 12)),
      };
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          categoryId: products.categoryId,
          images: products.images,
          sku: products.sku,
          createdAt: products.createdAt,
          categoryName: categories.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.id, input.id))
        .limit(1);

      return result[0] ?? null;
    }),

  getRelated: publicQuery
    .input(z.object({ id: z.number(), categoryId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          categoryId: products.categoryId,
          images: products.images,
          sku: products.sku,
          createdAt: products.createdAt,
          categoryName: categories.name,
        })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(
          and(
            eq(products.categoryId, input.categoryId),
            sql`${products.id} != ${input.id}`
          )
        )
        .orderBy(desc(products.createdAt))
        .limit(4);

      return result;
    }),

  count: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(products);
    return result[0]?.count ?? 0;
  }),

  create: publicQuery
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        price: z.number().positive(),
        categoryId: z.number(),
        images: z.array(z.string()).optional(),
        sku: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(products).values({
        name: input.name,
        description: input.description ?? "",
        price: input.price,
        categoryId: input.categoryId,
        images: input.images ?? [],
        sku: input.sku ?? `SKU-${Date.now()}`,
      });
      return result;
    }),

  update: publicQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(2).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        categoryId: z.number().optional(),
        images: z.array(z.string()).optional(),
        sku: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(products).set(data).where(eq(products.id, id));
      return { success: true };
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, input.id));
      return { success: true };
    }),
});
