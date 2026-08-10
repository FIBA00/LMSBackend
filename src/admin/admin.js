import adminUserRoute from "./user/user.admin.route.js";
import adminLibraryRoute from "./library/library.admin.route.js";

export default function registerAdminRoutes(app) {
	app.use("/api/admin/user", adminUserRoute);
	app.use("/api/admin/library", adminLibraryRoute);
}
