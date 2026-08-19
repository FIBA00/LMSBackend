import express from "express";
import {  isLoggedIn,  requireRole } from "../../middlewares/auth.middleware.js";
import { getAllUser, updateUserProfile } from "./user.admin.ctrl.js";

const adminUserRoute = express.Router();

adminUserRoute.get("/", isLoggedIn,  requireRole("admin"), getAllUser);
adminUserRoute.patch("/:id", isLoggedIn,requireRole("admin"), updateUserProfile);

export default adminUserRoute;
