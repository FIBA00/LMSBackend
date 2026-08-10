import { z } from "zod";

// Input: what a client is allowed to send you
export const CreateLibraryInput = z.object({
	name: z.string().trim().min(2, "Name is required !"),
	address: z.string().trim().min(5, "Address is required !"),
});

// Output: exact shape you promise to send back  - strips anything extra
export const LibraryResponse = z.object({
	id: z.number(),
	name: z.string().trim().min(5),
	ownerId: z.uuid(),
	status: z.string().trim().min(5),
	address: z.string().trim().default(""),
	reviewedBy: z.uuid(),
	reviewedAt: z.string(),
	createdAt: z.string(),
});
