import { authRouter } from "./auth-router";
import { adminRouter } from "./routers/admin-router";
import { productRouter } from "./routers/product-router";
import { categoryRouter } from "./routers/category-router";
import { blogRouter } from "./routers/blog-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  admin: adminRouter,
  product: productRouter,
  category: categoryRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;
