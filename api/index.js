import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

// ── Base de données ──────────────────────────────────────
function getDb() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        max: 5,
    });
    return drizzle(pool);
}

// ── tRPC ─────────────────────────────────────────────────
const t = initTRPC.create({ transformer: superjson });
const router = t.router;
const procedure = t.procedure;

const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "judickshop-admin-secret-key-2025";

// ── Router admin ─────────────────────────────────────────
const adminRouter = router({
    login: procedure
        .input(z.object({
            email: z.string().email(),
            password: z.string().min(1),
        }))
        .mutation(async ({ input }) => {
            const db = getDb();
            const result = await db.execute(
                `SELECT * FROM admin_users WHERE email = $1 LIMIT 1`,
                [input.email]
            );

            const admin = result.rows[0];
            if (!admin) throw new Error("Identifiants incorrects");

            const isValid = await bcrypt.compare(input.password, admin.password_hash);
            if (!isValid) throw new Error("Identifiants incorrects");

            const token = jwt.sign(
                { id: admin.id, email: admin.email },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            return { token, email: admin.email };
        }),

    me: procedure.query(async ({ ctx }) => {
        const authHeader = ctx.req.headers.get("x-admin-token");
        if (!authHeader) return null;
        try {
            const decoded = jwt.verify(authHeader, JWT_SECRET);
            return { id: decoded.id, email: decoded.email };
        } catch {
            return null;
        }
    }),
});

// ── Router produits ───────────────────────────────────────
const productRouter = router({
    list: procedure
        .input(z.object({
            categoryId: z.number().optional(),
            search: z.string().optional(),
            page: z.number().default(1),
            limit: z.number().default(12),
        }).optional())
        .query(async ({ input }) => {
            const db = getDb();
            const page = input?.page ?? 1;
            const limit = input?.limit ?? 12;
            const offset = (page - 1) * limit;

            let query = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
            const params = [];

            if (input?.categoryId) {
                params.push(input.categoryId);
                query += ` AND p.category_id = $${params.length}`;
            }
            if (input?.search) {
                params.push(`%${input.search}%`);
                query += ` AND p.name ILIKE $${params.length}`;
            }

            query += ` ORDER BY p.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
            params.push(limit, offset);

            const result = await db.execute(query, params);
            const countResult = await db.execute(`SELECT COUNT(*) as count FROM products`, []);
            const total = parseInt(countResult.rows[0]?.count ?? "0");

            return {
                items: result.rows,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            };
        }),

    count: procedure.query(async () => {
        const db = getDb();
        const result = await db.execute(`SELECT COUNT(*) as count FROM products`, []);
        return parseInt(result.rows[0]?.count ?? "0");
    }),

    create: procedure
        .input(z.object({
            name: z.string().min(2),
            description: z.string().optional(),
            price: z.number().positive(),
            categoryId: z.number(),
            images: z.array(z.string()).optional(),
            sku: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            const db = getDb();
            await db.execute(
                `INSERT INTO products (name, description, price, category_id, images, sku) VALUES ($1, $2, $3, $4, $5, $6)`,
                [input.name, input.description ?? "", input.price, input.categoryId, JSON.stringify(input.images ?? []), input.sku ?? `SKU-${Date.now()}`]
            );
            return { success: true };
        }),

    update: procedure
        .input(z.object({
            id: z.number(),
            name: z.string().optional(),
            description: z.string().optional(),
            price: z.number().optional(),
            categoryId: z.number().optional(),
            images: z.array(z.string()).optional(),
        }))
        .mutation(async ({ input }) => {
            const db = getDb();
            const { id, ...data } = input;
            const sets = Object.keys(data).map((k, i) => `${k} = $${i + 2}`).join(", ");
            await db.execute(`UPDATE products SET ${sets} WHERE id = $1`, [id, ...Object.values(data)]);
            return { success: true };
        }),

    delete: procedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            const db = getDb();
            await db.execute(`DELETE FROM products WHERE id = $1`, [input.id]);
            return { success: true };
        }),
});

// ── Router catégories ─────────────────────────────────────
const categoryRouter = router({
    list: procedure.query(async () => {
        const db = getDb();
        const result = await db.execute(
            `SELECT c.*, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON p.category_id = c.id GROUP BY c.id ORDER BY c.name`,
            []
        );
        return result.rows;
    }),

    create: procedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ input }) => {
            const db = getDb();
            await db.execute(`INSERT INTO categories (name) VALUES ($1)`, [input.name]);
            return { success: true };
        }),

    delete: procedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            const db = getDb();
            const count = await db.execute(`SELECT COUNT(*) as count FROM products WHERE category_id = $1`, [input.id]);
            if (parseInt(count.rows[0]?.count ?? "0") > 0) {
                throw new Error("Impossible de supprimer une catégorie avec des produits");
            }
            await db.execute(`DELETE FROM categories WHERE id = $1`, [input.id]);
            return { success: true };
        }),
});

// ── Router blog ───────────────────────────────────────────
const blogRouter = router({
    list: procedure
        .input(z.object({
            page: z.number().default(1),
            limit: z.number().default(9),
        }).optional())
        .query(async ({ input }) => {
            const db = getDb();
            const page = input?.page ?? 1;
            const limit = input?.limit ?? 9;
            const offset = (page - 1) * limit;
            const result = await db.execute(
                `SELECT * FROM blog_posts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
                [limit, offset]
            );
            const countResult = await db.execute(`SELECT COUNT(*) as count FROM blog_posts`, []);
            const total = parseInt(countResult.rows[0]?.count ?? "0");
            return { items: result.rows, total, page, totalPages: Math.ceil(total / limit) };
        }),

    getById: procedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            const db = getDb();
            const result = await db.execute(`SELECT * FROM blog_posts WHERE id = $1`, [input.id]);
            return result.rows[0] ?? null;
        }),

    create: procedure
        .input(z.object({
            title: z.string().min(2),
            content: z.string().min(10),
            coverImage: z.string().optional(),
            category: z.string().optional(),
        }))
        .mutation(async ({ input }) => {
            const db = getDb();
            await db.execute(
                `INSERT INTO blog_posts (title, content, cover_image, category) VALUES ($1, $2, $3, $4)`,
                [input.title, input.content, input.coverImage, input.category]
            );
            return { success: true };
        }),

    delete: procedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            const db = getDb();
            await db.execute(`DELETE FROM blog_posts WHERE id = $1`, [input.id]);
            return { success: true };
        }),
});

// ── App router principal ──────────────────────────────────
const appRouter = router({
    ping: procedure.query(() => ({ ok: true, ts: Date.now() })),
    admin: adminRouter,
    product: productRouter,
    category: categoryRouter,
    blog: blogRouter,
});

// ── Hono app ──────────────────────────────────────────────
const app = new Hono();
app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.use("/api/trpc/*", async (c) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext: () => ({ req: c.req.raw, resHeaders: new Headers() }),
    });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;