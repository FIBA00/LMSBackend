import express from "express";
import { isLoggedIn ,  requireRole} from "../middlewares/auth.middleware.js";
import {
	getUserLibraries,
	createUserLibrary,
	deleteUserLibrary,
	updateUserLibrary,
	getPublicLibraries,
} from "../controllers/library.ctrl.js";

import respondWith from "../middlewares/response.middleware.js"
import inputValidationBody from "../middlewares/validation.middleware.js";
import {PublicLibraryListResponse, OwnerLibraryListResponse , OwnerLibraryResponse, CreateLibraryInput, UpdateLibraryInput} from "../schemas/library.schema.js"

const libraryRoute = express.Router();

libraryRoute.get("/pub", respondWith(PublicLibraryListResponse), getPublicLibraries);
libraryRoute.get("/", isLoggedIn,   requireRole("owner"), respondWith(OwnerLibraryListResponse), getUserLibraries);
libraryRoute.post("/", isLoggedIn,   requireRole("owner"),  inputValidationBody(CreateLibraryInput), respondWith(OwnerLibraryResponse), createUserLibrary);
libraryRoute.patch("/:id", isLoggedIn,   requireRole("owner"),  inputValidationBody(UpdateLibraryInput), respondWith(OwnerLibraryResponse),  updateUserLibrary);
libraryRoute.delete("/:id", isLoggedIn,   requireRole("owner"), respondWith(OwnerLibraryResponse), deleteUserLibrary);

export default libraryRoute;

// The lesson worth keeping from this one specifically: a response schema has to mirror exactly what that particular query selects — not "the model," but the actual select({...}) shape, aliases included. Two controllers touching the same table can legitimately need two different response schemas if they select different columns or rename them. This is different from the request-side schemas (CreateLibraryInput), which only need to match what you're willing to accept — those can stay generic across routes more easily.
