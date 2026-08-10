import express from "express";
import { isAdmin, isLoggedIn } from "../../middlewares/auth.middleware.js";
import {
	getAllLibrary,
	getLibrary,
	approveLibrary,
	suspendLibrary,
	deleteLibrary,
	rejectLibrary,
} from "./library.admin.ctrl.js";

const adminLibraryRoute = express.Router();

// adming routes
adminLibraryRoute.get("/", isLoggedIn, isAdmin, getAllLibrary);
adminLibraryRoute.get("/:id", isLoggedIn, isAdmin, getLibrary);
adminLibraryRoute.post("/approve/:id", isLoggedIn, isAdmin, approveLibrary);
adminLibraryRoute.post("/suspend/:id", isLoggedIn, isAdmin, suspendLibrary);
adminLibraryRoute.post("/reject/:id", isLoggedIn, isAdmin, rejectLibrary);
adminLibraryRoute.delete("/:id", isLoggedIn, isAdmin, deleteLibrary);

export default adminLibraryRoute;
