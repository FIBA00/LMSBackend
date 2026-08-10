import express from "express";
import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
	getUserLibraries,
	createUserLibrary,
	deleteUserLibrary,
	updateUserLibrary,
	getPublicLibraries,
} from "../controllers/library.ctrl.js";

const libraryRoute = express.Router();

libraryRoute.get("/pub", getPublicLibraries);
libraryRoute.get("/", isLoggedIn, getUserLibraries);
libraryRoute.post("/", isLoggedIn, createUserLibrary);
libraryRoute.patch("/:id", isLoggedIn, updateUserLibrary);
libraryRoute.post("/:id", isLoggedIn, deleteUserLibrary);

export default libraryRoute;
