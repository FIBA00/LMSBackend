import { z } from "zod";

// Input: what a client is allowed to send you
export const CreateRentalsInput = z.object({
	title: z.string().trim().min(5, "Title is required"),
	description: z.string().optional().default(""),
});

// Output: exact shape you promise to send back  - strips anything extra
export const RentalsResponse = z.object({
	id: z.number(),
	title: z.string().trim().min(5),
	description: z.string().trim().default(""),
	isRented: z.boolean(),
});
