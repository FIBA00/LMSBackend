import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import process from "node:process";

// internal import
import "../configs/env.config.js";
import { db } from "../db/database.js";
import { users } from "../db/models.js";

const SECRET = process.env.JWT_SECRET;

export function setAuthCookie(res, token) {
	res.cookie("accessToken", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 2 * 60 * 60 * 1000, // 2h
	});
}

export function clearAuthCookie(res) {
	res.clearCookie("accessToken")
}

export function generateToken(user) {
	try {
		return jwt.sign(
			{
				id: user.id,
				email: user.email,
				role: user.role,
				tokenVersion: user.tokenVersion,
			},
			SECRET,
			{ expiresIn: "2h" },
		);
	} catch (error) {
		console.log("Error while generating token: ", error.message);
	}
}

export function verifyToken(token) {
	try {
		if (!SECRET) {
			throw new Error(
				"JWT secret is missing. set JWT_SECRET in your .env file.",
			);
		}
		return jwt.verify(token, SECRET);
	} catch (error) {
		console.log("error while verify token: ", error.message);
	}
}

export async function authenticateToken(token) {
	try {
		const decoded = verifyToken(token); //throws on invalid/expired
		const [currentUser] = await db
			.select()
			.from(users)
			.where(eq(users.id, decoded.id));
		if (!currentUser || currentUser.tokenVersion !== decoded.tokenVersion) {
			return null;
		}
		return currentUser;
	} catch (error) {
		console.log("Error while authenticating token: ", error.message);
	}
}

export async function isLoggedIn(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid token provided." });
		}
		
		const token = req.cookies?.accessToken;
		if (!token) {
			return res
				.status(401)
				.json({ success: false, message: "No token provided" });
		}
		try {
			const currentUser = await authenticateToken(token);
			if (!currentUser) {
				return res.status(401).json({
					success: false,
					message: "Invalid or expired token.",
				});
			}
			req.user = currentUser;
			console.debug("Current user: ", req.user);
			return next();
		} catch (error) {
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({
					success: false,
					message: "Token expired.",
				});
			}
			console.log("Error while checking auth token: ", error.message);
			return res.status(401).json({
				success: false,
				message: "No token provided.",
			});
		}
	} catch (error) {
		console.log("Error while checking user is logged in: ", error.message);
	}
}

export const isAdmin = function (req, res, next) {
	try {
		if (req.user.role !== "admin") {
			return res.status(403).json({
				success: false,
				message: "Access denied admins only !!!",
			});
		}
		next();
	} catch (error) {
		console.log("Error while checking is admin.", error.message);
	}
};
export async function comparePassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}

export default {
	generateToken,
	verifyToken,
	isLoggedIn,
	isAdmin,
	authenticateToken,
	comparePassword,
};
