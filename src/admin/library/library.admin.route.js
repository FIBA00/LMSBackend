import express from "express";
import {  isLoggedIn, requireRole, } from "../../middlewares/auth.middleware.js";
import {
	getAllLibrary,
	getLibrary,
	approveLibrary,
	suspendLibrary,
	deleteLibrary,
	rejectLibrary,
} from "./library.admin.ctrl.js";
import {LibraryResponse, LibraryListResponse } from "../../schemas/library.schema.js"
import respondWith from "../../middlewares/response.middleware.js"
const adminLibraryRoute = express.Router();

// adming routes
adminLibraryRoute.get("/", isLoggedIn, requireRole("admin"), respondWith(LibraryListResponse), getAllLibrary);
adminLibraryRoute.get("/:id", isLoggedIn, requireRole("admin"), respondWith(LibraryResponse), getLibrary);
adminLibraryRoute.post("/approve/:id", isLoggedIn, requireRole("admin"), respondWith(LibraryResponse), approveLibrary);
adminLibraryRoute.post("/suspend/:id", isLoggedIn, requireRole("admin"), respondWith(LibraryResponse), suspendLibrary);
adminLibraryRoute.post("/reject/:id", isLoggedIn, requireRole("admin"), respondWith(LibraryResponse), rejectLibrary);
adminLibraryRoute.delete("/:id", isLoggedIn, requireRole("admin"), respondWith(LibraryResponse), deleteLibrary);


export default adminLibraryRoute;
