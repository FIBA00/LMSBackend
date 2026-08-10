import { eq } from "drizzle-orm";
import { db } from "../../db/database.js";
import { libraries } from "../../db/models.js";

export async function getAllLibrary(req, res) {
	try {
		const allLibraries = await db.select().from(libraries);
		return res.status(200).json({
			success: true,
			message: "Successfully retrieved libraries.",
			libraries: allLibraries,
		});
	} catch (error) {
		console.error("Error while getting libraries:", error.message);
		return res.status(500).json({
			success: false,
			message: "Server error while getting libraries.",
		});
	}
}

export async function getLibrary(req, res) {
	try {
		const [library] = await db
			.select()
			.from(libraries)
			.where(eq(libraries.id, req.params.id));

		if (!library) {
			return res
				.status(404)
				.json({ success: false, message: "No library with given id." });
		}
		return res.status(200).json({
			success: true,
			message: "Successfully retrieved library.",
			library,
		});
	} catch (error) {
		console.error("Error while getting library:", error.message);
		return res.status(500).json({
			success: false,
			message: "Server error while getting library.",
		});
	}
}

export async function updateLibrary(req, res) {
	// TODO: decide what admins can update that owners can't — placeholder, disabled from routes.
	return res
		.status(501)
		.json({ success: false, message: "Not implemented yet." });
}

// Shared logic — approve/suspend/reject only differ by target status.
// IsAdmin middleware already guarantees req.user.role === "admin" by the time this runs.
async function reviewLibrary(req, res, status) {
	try {
		const libraryId = req.params.id;
		const reviewedBy = req.user.id;
		const reviewedAt = new Date();

		const [library] = await db
			.update(libraries)
			.set({ status, reviewedBy, reviewedAt })
			.where(eq(libraries.id, libraryId))
			.returning();

		if (!library) {
			return res
				.status(404)
				.json({ success: false, message: "Library not found." });
		}

		return res.status(200).json({
			success: true,
			message: `Successfully ${status} library.`,
			library,
		});
	} catch (error) {
		console.error(
			`Error while setting library status to ${status}:`,
			error.message,
		);
		return res.status(500).json({
			success: false,
			message: `Server error while updating library status.`,
		});
	}
}

export const approveLibrary = (req, res) => reviewLibrary(req, res, "approved");
export const suspendLibrary = (req, res) =>
	reviewLibrary(req, res, "suspended");
export const rejectLibrary = (req, res) => reviewLibrary(req, res, "rejected");

export async function deleteLibrary(req, res) {
	// IsAdmin middleware already handles the permission check — no inline role check needed here anymore.
	try {
		const libraryId = req.params.id;

		const [library] = await db
			.select()
			.from(libraries)
			.where(eq(libraries.id, libraryId));

		if (!library) {
			return res
				.status(404)
				.json({ success: false, message: "Library not found." });
		}

		const [deleted] = await db
			.delete(libraries)
			.where(eq(libraries.id, libraryId))
			.returning();

		return res.status(200).json({
			success: true,
			message: "Successfully deleted library.",
			libraryInfo: deleted,
		});
	} catch (error) {
		console.error("Error while deleting library:", error.message);
		return res.status(500).json({
			success: false,
			message: "Server error while deleting library.",
		});
	}
}
