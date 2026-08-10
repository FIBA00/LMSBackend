import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import process from "node:process";

// internal import
import * as model from "./models.js";
import "../configs/env.config.js";

const DATABASE_URL = process.env.DATABASE_URL;

const pool = new Pool({
	connectionString: DATABASE_URL,
});
const db = drizzle(pool, { model });

export { DATABASE_URL, db };
