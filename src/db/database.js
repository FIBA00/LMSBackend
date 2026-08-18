import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import process from "node:process";

// internal import
import * as model from "./models.js";
import "../configs/env.config.js";

const DB_URL = process.env.DATABASE_URL;


// create new database pull using connection string or construct from env 
const pool = new Pool({
	connectionString: DB_URL,

});
const db = drizzle(pool, { model });

export { DB_URL, db };
