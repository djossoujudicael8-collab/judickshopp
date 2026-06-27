import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../lib/env.js";
import * as schema from "../../db/schema.js";
import * as relations from "../../db/relations.js";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema>>;

export function getDb() {
  if (!instance) {
    const pool = new Pool({
      connectionString: env.databaseUrl,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
    instance = drizzle(pool, { schema: fullSchema });
  }
  return instance;
}