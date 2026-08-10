import express from "express";
import morgan from "morgan";
import process from "node:process";

// internal imports
import "./configs/env.config.js";
import registerRoutes from "./routes/main.js";
import registerAdminRoutes from "./admin/admin.js";

const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(morgan("common"));

app.get("/health", (req, res) =>
	res.status(200).json({
		success: true,
		status: "System healthy . :)",
	}),
);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

registerRoutes(app);
registerAdminRoutes(app);
