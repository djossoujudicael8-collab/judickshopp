import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { categories, products } from "@db/schema";
import { eq, sql } from "drizzle-orm";

export const categoryRouter = createRouter({
  list: publicQuery.query(async () => {
    const db = getDb();
    const result = await db
      .select({
        id: categories.id,
        name: categories.name,
        createdAt: categories.createdAt,
        productCount: sql<number>`(SELECT COUNT(*) FROM ${products} WHERE ${products.categoryId} = ${categories.id})`,
      })
      .from(categories)
      .orderBy(categories.name);

    return result;
  }),

  create: publicQuery
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(categories).values({
        name: input.name,
      });
      return result;
    }),

  delete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      // Check if category has products
      const productCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(eq(products.categoryId, input.id));

      if (productCount[0]?.count ?? 0 > 0) {
        throw new Error("Cannot delete category with existing products");
      }

      await db.delete(categories).where(eq(categories.id, input.id));
      return { success: true };
    }),
});
