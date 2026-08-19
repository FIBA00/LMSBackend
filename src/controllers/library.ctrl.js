// backend/src/controllers/library.ctrl.js

import { eq, and } from "drizzle-orm";

// internal imports
import { db } from "../db/database.js";
import { libraries } from "../db/models.js";

export async function getPublicLibraries(req, res) {
	try {
		const approvedLibraries = await db
			.select({
				id: libraries.id,
				name: libraries.name,
				address: libraries.address,
			})
			.from(libraries)
			.where(eq(libraries.status, "approved"));
		// deliberately NOT selecting reviewedBy/reviewedAt here either —
		// that's internal admin metadata, a patron browsing libraries has no reason to see it

		return res.status(200).json({
			success: true,
			message: "Successfully retrieved libraries.",
			data: approvedLibraries,
		});
	} catch (error) {
		console.error("Error while getting public libraries:", error.message);
		return res.status(500).json({
			success: false,
			message: "Server error while getting libraries.",
		});
	}
}

export async function getUserLibraries(req, res) {
	try {
		const userid = req.user.id;

		const userLibraries = await db
			.select({
				id: libraries.id,
				name: libraries.name,
				owner: libraries.ownerId,
				status: libraries.status,
				address: libraries.address,
				reviewedBy: libraries.reviewedBy,
				reviewedAt: libraries.reviewedAt,
				createdAt: libraries.createdAt,
			})
			.from(libraries)
			.where(eq(libraries.ownerId, userid));

		// no `!userLibraries` check needed — .select() never returns undefined,
		// an empty array [] is the correct "you own zero libraries" answer, not an error

		return res.status(200).json({
			success: true,
			message: "successfully retreived library",
			data: userLibraries,
		});
	} catch (error) {
		console.error("Error while getting libraries", error.message);
		return res.status(500).json({
			success: false,
			message: "Server error while getting user libraries.",
		});
	}
}

export async function createUserLibrary(req, res) {
	try {
		const userid = req.user.id;
		const [library] = await db
			.insert(libraries)
			.values({
				name: req.body.name,
				address: req.body.address,
				ownerId: userid,
			})
			.returning();

		if (!library) {
			return res.status(404).json({
				success: false,
				message: "Library creation failed.",
			});
		}

		return res.status(201).json({
			success: true,
			message: "Library created successfully, wait for approval",
			data: {
				id: library.id,
				name: library.name,
				owner: library.ownerId,
				status: library.status,
				address: library.address,
				reviewedBy: library.reviewedBy,
				reviewedAt: library.reviewedAt,
				createdAt: library.createdAt,
			},
		});
	} catch (error) {
		console.error("Error while creating library for user: ", error.message);
		return res.status(500).json({
			success: false,
			message: "Server error while creating user libary.",
		});
	}
}

export async function updateUserLibrary(req, res) {
	try {
		const userId = req.user.id;
		const libraryId = req.params.id;

		const [library] = await db
			.update(libraries)
			.set({ name: req.body.name, address: req.body.address })
			.where(and(eq(libraries.id, libraryId), eq(libraries.ownerId, userId)))
			.returning();

		if (!library) {
			return res.status(404).json({ success: false, message: "Library not found or not owned by you !." });
		}

		return res.status(200).json({ success: true, message: "Successfully updated library.", data: library });
	} catch (error) {
		console.error("error while managing library: ", error.message);
		return res.status(500).json({
			success: false,
			message: "Server error while managing libraries !.",
		});
	}
}

export async function deleteUserLibrary(req, res) {
	try {
		const userId = req.user.id;
		const libraryId = req.params.id;

		const [deleted] = await db
			.delete(libraries)
			.where(and(eq(libraries.id, libraryId), eq(libraries.ownerId, userId)))
			.returning();

		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: "Library not found or not owned by you !.",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Library deleted successfully! ",
			data: deleted,
		});
	} catch (error) {
		console.error(
			"Error while deleteing library for user: ",
			error.message,
		);
		return res.status(500).json({
			success: false,
			message: "server error while deleteing user library.",
		});
	}
}