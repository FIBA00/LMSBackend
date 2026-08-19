import express from "express";
import {
	userCurrent,
	userProfile,
	userSignup,
	userLogin,
} from "../controllers/user.ctlr.js";

import inputValidationBody from "../middlewares/validation.middleware.js";
import respondWith from "../middlewares/response.middleware.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

import { UserCreate, UserLogin, UserProfile } from "../schemas/user.schema.js";

const userRoute = express.Router();

userRoute.get("/me", isLoggedIn, respondWith(UserProfile), userCurrent);
userRoute.get("/me/:id", isLoggedIn, respondWith(UserProfile), userProfile);
userRoute.post("/signup", inputValidationBody(UserCreate), userSignup);
userRoute.post("/login", inputValidationBody(UserLogin), userLogin);

export default userRoute;
