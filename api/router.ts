import { authRouter } from "./auth-router.js";
import { adminRouter } from "./routers/admin-router.js";
import { productRouter } from "./routers/product-router.js";
import { categoryRouter } from "./routers/category-router.js";
import { blogRouter } from "./routers/blog-router.js";
import { createRouter, publicQuery } from "./middleware.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  admin: adminRouter,
  product: productRouter,
  category: categoryRouter,
  blog: blogRouter,
});

export type AppRouter = typeof appRouter;