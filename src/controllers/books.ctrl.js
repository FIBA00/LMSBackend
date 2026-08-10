import { eq } from "drizzle-orm";
import { db } from "../db/database.js";
import { books } from "../db/models.js";

import { BookResponse } from "../schemas/book.schema.js";

export async function bookAll(req, res) {
	try {
		const unrentedBooks = await db
			.select()
			.from(books)
			.where(eq(books.isRented, false));

		return res.status(200).json({
			success: true,
			message: "Book 1",
			Books: unrentedBooks,
		});
	} catch (error) {
		console.log("Error while getting all books", error.message);

		return res.status(500).json({
			success: false,
			message: "Error while getting all books:",
			error: error.message,
		});
	}
}

export async function bookCreate(req, res) {
	try {
		const [book] = await db
			.insert(books)
			.values({
				...req.body,
				isRented: false,
			})
			.returning();

		const shaped = BookResponse.parse(book);

		return res.status(201).json({
			success: true,
			message: "Book created successfully",
			book: shaped,
		});
	} catch (error) {
		console.log("Error while creating book", error.message);

		return res.status(500).json({
			success: false,
			message: "Failed to create book.",
		});
	}
}

export async function bookDelete(req, res) {
	try {
		const [book] = await db
			.delete(books)
			.where(eq(book.id, req.params.id))
			.returning();

		// TODO: check if bug may occus here due to returning function call.
		if (!book) {
			return res.status(404).json({
				success: false,
				message: "Book not found with given id.",
			});
		}
		return res.status(200).json({
			success: true,
			message: "Book deleted!",
			book,
		});
	} catch (error) {
		console.log("Error while deleting book: ", error.message);

		return res.status(500).json({
			success: false,
			message: "Error while deleting book",
		});
	}
}

export async function bookRent(req, res) {
	try {
		// since one man operation or self service we need only the user info
		// when changing this.

		const [book] = await db
			.update(books)
			.set({ userId: req.body.userId, isRented: true })
			.where(eq(books.id, req.params.id))
			.returning();
		if (!book) {
			return res
				.status(404)
				.json({ success: false, message: "Book not found." });
		}
		return res.status(200).json({
			success: true,
			message: "Successfully rented book with given id to given user.",
			book: book,
		});
	} catch (error) {
		console.log("Error while creating book rent: ", error.message);

		return res.status(500).json({
			success: false,
			message: "Error while creating book rent.",
		});
	}
}

export async function bookReturn(req, res) {
	try {
		// FIX: this part can be little bit tricky becuase we need to check  who rented the book and make isRented false
		const [book] = await db
			.update(books)
			.set({ userId: null, isRented: false })
			.where(eq(books.id, req.params.id))
			.returning();
		if (!book) {
			return res
				.status(404)
				.json({ success: false, message: "Book not found." });
		}
		return res.status(200).json({
			success: true,
			message: "Successfully returned the book to the library.",
			// TODO: return the book the user and the user returned info.
			book: book,
		});
	} catch (error) {
		console.log("error while checking book return: ", error.message);
		return req.status(500).json({
			success: false,
			message: "Error while creating book returned",
		});
	}
}
