import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const rootDir = path.resolve(fileURLToPath(new URL("../..", import.meta.url)));
const envFile =
	process.env.NODE_ENV === "production"
		? path.join(rootDir, ".env.production")
		: path.join(rootDir, ".env.local");

dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: envFile, override: true });

console.log("NODE_ENV =", process.env.NODE_ENV);
