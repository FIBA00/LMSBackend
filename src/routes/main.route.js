import userRoute from "./user.route.js";
import booksRoute from "./books.route.js";
import libraryRoute from "./library.route.js";

export default function registerRoutes(app) {
	app.use("/api/user", userRoute);
	app.use("/api/library", libraryRoute);
	app.use("/api/books", booksRoute);
}
