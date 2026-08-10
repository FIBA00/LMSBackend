import "dotenv/config"; // 1. CRITICAL: Loads your .env variables first!
import { DATABASE_URL } from "../db/database.js";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users } from "../db/models.js";
import bcrypt from "bcrypt";
import process from "node:process";

// Create the pool outside so we can safely close it in the finally block
const pool = new Pool({
	connectionString: DATABASE_URL,
});

// 2. Wrap it properly in the correct Drizzle options object config format
const db = drizzle(pool, { schema: { users } });

async function seedAdmin() {
	try {
		// Verify environment variables actually loaded before hashing
		if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_EMAIL) {
			throw new Error(
				"Missing ADMIN_PASSWORD or ADMIN_EMAIL in environment variables.",
			);
		}

		const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

		const [admin] = await db
			.insert(users)
			.values({
				username: process.env.ADMIN_USERNAME || "admin",
				email: process.env.ADMIN_EMAIL,
				passwordHash: hashed,
				phone: process.env.ADMIN_PHONE || "",
				role: "admin",
			})
			.returning();

		console.log("Admin created successfully:", admin);
	} catch (error) {
		console.error(`Error while creating admin: ${error.message}`);
	} finally {
		// 3. This block ALWAYS runs, guaranteeing your terminal returns cleanly
		await pool.end();
		process.exit(0);
	}
}

seedAdmin();
