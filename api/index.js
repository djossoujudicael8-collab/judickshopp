/**
 * Point d'entrée Vercel pour l'API JUDICKSHOP
 * Ce fichier adapte le serveur Hono pour fonctionner
 * comme une fonction serverless sur Vercel.
 */
import { handle } from "@hono/node-server/vercel";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";

const app = new Hono();

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));

// Route tRPC — toutes les API passent par ici
app.use("/api/trpc/*", async (c) => {
    return fetchRequestHandler({
        endpoint: "/api/trpc",
        req: c.req.raw,
        router: appRouter,
        createContext,
    });
});

app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

// Export pour Vercel (fonctions serverless Node.js)
export default handle(app);
