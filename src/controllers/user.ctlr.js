import { eq } from "drizzle-orm";
import { db } from "../db/database.js";
import { users } from "../db/models.js";
import bcrypt from "bcrypt";
import {
	generateToken,
	comparePassword,
	setAuthCookie
} from "../middlewares/auth.middleware.js";

export async function userCurrent(req, res) {
    try {
        return res.status(200).json({
            success: true,
            data: {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
                phone: req.user.phone,
                role: req.user.role,
            },
        });
    } catch (error) {
        console.log("Error while fetching current user: ", error.message);
        return res.status(500).json({
            success: false,
            message: "Error while fetching current user.",
        });
    }
}

export async function userProfile(req, res) {
	try {
		const isSelf = String(req.user.id) === String(req.params.id);
		const isAdmin = req.user.role === "admin";

		if (!isSelf && !isAdmin) {
			return res
				.status(403)
				.json({ success: false, message: "Access denied !" });
		}

		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.id, req.params.id));

		if (!user) {
			return res
				.status(404)
				.json({ success: false, message: "User not found." });
		}
		return res.status(200).json({
			success: true,
			message: "Hello there user",
			data: { userId: user.id, userEmail: user.email },
		});
	} catch (error) {
		console.log("Error while checking user profile: ", error.message);
		return res.status(500).json({
			success: false,
			message: "Error while handling user",
		});
	}
}
export async function userSignup(req, res) {
	try {
		const [ExistingUserEmail] = await db
			.select()
			.from(users)
			.where(eq(users.email, req.body.email));

		if (ExistingUserEmail) {
			return res.status(400).json({
				success: false,
				message: "Email already exists !.",
			});
		}
		const [ExistingUserName] = await db
			.select()
			.from(users)
			.where(eq(users.username, req.body.username));

		if (ExistingUserName) {
			return res.status(400).json({
				success: false,
				message: "User name already exists !.",
			});
		}
		const HashedPassword = await bcrypt.hash(req.body.password, 10);
		const [newUser] = await db
			.insert(users)
			.values({
				username: req.body.username,
				email: req.body.email,
				passwordHash: HashedPassword,
				phone: req.body.phone,
			})
			.returning();

		console.debug("New user: ", newUser);
		const Token = generateToken(newUser);
		setAuthCookie(res, Token)
		return res.status(201).json({
			success: true,
			message: "User registered successfully.",
			data: {
				userId: newUser.id,
				userPhone: newUser.phone,
				userEmail: newUser.email,
			},
		});
	} catch (error) {
		if (error.code === "23505") {
			if (error.constraint?.includes("username")) {
				return res.status(409).json({
					success: false,
					message: "Username already taken.",
				});
			}
			// postgres unique_violation
			return res
				.status(409)
				.json({ success: false, message: "Email already registered." });
		}
		console.log("Error while signing up user:", error.message);
		return res
			.status(500)
			.json({ success: false, message: "Error signing up user." });
	}
}

export async function userLogin(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({
				success: false,
				message: "Email and password are required.",
			});
		}

		const [userEmail] = await db
			.select()
			.from(users)
			.where(eq(users.email, email));

		if (!userEmail) {
			return res.status(400).json({
				success: false,
				message:
					"Invalid email or password, I DONT KNOW WHAT YOU HAVE DONE :-> SOMETHING IS WRONG.",
			});
		}
		const [user] = await db
			.select()
			.from(users)
			.where(eq(users.email, email));

		console.log("Password passed:", password);
		console.log("User object from DB:", user); // Look closely at the keys here!

		const isPasswordMatch = await comparePassword(
			password,
			user.passwordHash,
		);
		if (!isPasswordMatch) {
			return res.status(401).json({
				success: false,
				message:
					"Invalid email or password, FILL CORRECT CREDENTIALS! ",
			});
		}

		const Token = generateToken(user);
		setAuthCookie(res, Token)
		return res.status(200).json({
			success: true,
			message: "User Logged in succesfully !.",
			data: {
				id: user.id,
				username: user.username,
				email: user.email,
				phone: user.phone,
				role: user.role,
			},
		});
	} catch (error) {
		console.log("Failed to login user", error);

		return res.status(501).json({
			success: false,
			message: "User login failed !",
		});
	}
}

export async function userUpdate(req, res) {
	try {
		const { username } = req.body;
		const userId = req.body.id;

		// TODO: implementswor email verification where updating.
		if (!username) {
			return res.status(400).json({
				success: false,
				message: "username is required.",
			});
		}

		const [userid] = await db
			.select()
			.from(users)
			.where(eq(users.id, userId));

		if (!userid) {
			return res.status(400).json({
				success: false,
				message:
					"Invalid user id I DONT KNOW WHAT YOU HAVE DONE :-> SOMETHING IS WRONG.",
			});
		}
		const [user] = await db
			.update(users)
			.set({ username: username })
			.where(eq(users.id, userId))
			.returning();

		console.log("User object from DB:", user); // Look closely at the keys here!

		return res.status(200).json({
			success: true,
			message: "User updated  succesfully !.",
			data: {
				id: user.id,
				username: user.username,
				email: user.email,
				phone: user.phone,
				role: user.role,
			},
		});
	} catch (error) {
		console.error("Error while updating the user: ", error.message);
		return req.status(501).json({
			success: false,
			message: "Server error while updating use profile.",
		});
	}
}
