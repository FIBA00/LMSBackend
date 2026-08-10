import { eq } from "drizzle-orm";
import { db } from "../../db/database.js";
import { users } from "../../db/models.js";

export async function getAllUser(req, res) {
	try {
		const isSelf = String(req.user.id) === String(req.params.id);
		const isAdmin = req.user.role == "admin";

		if (!isSelf && !isAdmin) {
			return res.status(403).json({
				success: false,
				message: "Access denied",
			});
		}

		const normalUsers = await db.select().from(users);
		// TODO: pagination is needed for the users

		if (!normalUsers) {
			return res.status(404).json({
				success: false,
				message: "User not found.",
			});
		}
		return res.status(200).json({
			success: true,
			message: "Successfully retrieved all the users !",
			users_info: normalUsers,
			// userInfo: { userId: user.id, userEmail: user.email },
		});
	} catch (error) {
		console.log("Error while getting user profile: ", error.message);
		return res.status(500).json({
			success: false,
			message: "Error while handling user",
		});
	}
}

export async function updateUserProfile(req, res) {
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
			userInfo: { userId: user.id, userEmail: user.email },
		});
	} catch (error) {
		console.log("Error while checking user profile: ", error.message);
		return res.status(500).json({
			success: false,
			message: "Error while handling user",
		});
	}
}
