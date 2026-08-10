import express from "express";
import { isAdmin, isLoggedIn } from "../../middlewares/auth.middleware.js";
import { getAllUser, updateUserProfile } from "./user.admin.ctrl.js";

const adminUserRoute = express.Router();

adminUserRoute.get("/", isLoggedIn, isAdmin, getAllUser);
adminUserRoute.patch("/:id", isLoggedIn, isAdmin, updateUserProfile);

export default adminUserRoute;
