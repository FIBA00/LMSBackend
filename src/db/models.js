import {
	pgTable,
	text,
	timestamp,
	boolean,
	integer,
	uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	username: text("username").notNull().unique(),
	phone: text("phone").notNull(),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	role: text("role", { enum: ["patron", "staff", "owner", "admin"] })
		.notNull()
		.default("patron"),
	libraryId: uuid("library_id").references(() => libraries.id), // which library, if staff — null for patrons/owners
	emailVerified: boolean("email_verified").notNull().default(false),
	phoneVerified: boolean("phone_verified").notNull().default(false),
	address: text("address"),
	tokenVersion: integer("token_version").notNull().default(0),
	createdAt: timestamp("created_at").defaultNow(),
});
export const books = pgTable("books", {
	id: uuid("id").defaultRandom().primaryKey(),
	libraryId: uuid("library_id")
		.notNull()
		.references(() => libraries.id), // also fixed the "libary" typo
	title: text("title").notNull(),
	description: text("description").default(""),
	qrCode: text("qr_code").notNull().unique(),
});

export const libraries = pgTable("libraries", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	ownerId: uuid("owner_id")
		.notNull()
		.references(() => users.id),
	status: text("status", {
		enum: ["pending", "approved", "rejected", "suspended"],
	})
		.notNull()
		.default("pending"),
	address: text("address").notNull(),
	proofDocumentUrl: text("proof_document_url"), // business license/registration,  uplaoded file link,
	reviewedBy: uuid("reviewed_by").references(() => users.id), //which platform admin  approved/rejectd.
	reviewedAt: timestamp("reviewed_at"),
	createdAt: timestamp("created_at").defaultNow(),
});

export const rentals = pgTable("rentals", {
	id: uuid("id").defaultRandom().primaryKey(),
	libraryId: uuid("library_id")
		.notNull()
		.references(() => libraries.id),
	bookId: uuid("book_id")
		.notNull()
		.references(() => books.id),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	channel: text("channel", { enum: ["physical", "online"] }).notNull(),
	assistedBy: uuid("assisted_by").references(() => users.id),
	status: text("status", { enum: ["reserved", "active", "returned", "lost"] })
		.notNull()
		.default("returned"),
	checkedOutAt: timestamp("checked_out_at"),
	dueAt: timestamp("due_at"),
	returnedAt: timestamp("returned_at"),
});

export const verificationCodes = pgTable("verification_codes", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	type: text("type", { enum: ["email", "phone"] }).notNull(),
	code: text("code").notNull(),
	attempts: integer("attempts").notNull().default(0),
	expiresAt: timestamp("expires_at").notNull(),
	verifiedAt: timestamp("verified_at"),
	createdAt: timestamp("created_at").defaultNow(),
});
