import { DATABASE_URL } from "./src/db/database.js";

export default {
	schema: "./src/db/models.js",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: { url: DATABASE_URL },
};
