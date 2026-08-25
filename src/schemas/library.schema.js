import { z } from "zod";

// public browse — only 3 fields selected
export const PublicLibraryResponse = z.object({
    id: z.string(),
    name: z.string().trim().min(2),
    address: z.string().trim(),
});

// Input: what a client is allowed to send you
export const CreateLibraryInput = z.object({
    name: z.string().trim().min(2, "Name is required !"),
    address: z.string().trim().min(5, "Address is required !"),
});

// Output: exact shape you promise to send back  - strips anything extra
export const LibraryResponse = z.object({
    id: z.string(),
    name: z.string().trim().min(2),
    ownerId: z.uuid(),
    status: z.enum([ "pending", "approved", "rejected", "suspended" ]),
    address: z.string().trim(),
    proofDocumentUrl: z.string().nullable(),
    reviewedBy: z.uuid().nullable(),
    reviewedAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
});

// owner's own view — note "owner", not "ownerId", matches the select() alias
export const OwnerLibraryResponse = z.object({
    id: z.string(),
    name: z.string().trim().min(2),
    owner: z.uuid(),
    status: z.enum([ "pending", "approved", "rejected", "suspended" ]),
    address: z.string().trim(),
    reviewedBy: z.uuid().nullable(),
    reviewedAt: z.coerce.date().nullable(),
    createdAt: z.coerce.date(),
});

// getAllLibrary returns an array of libraries, getLibrary/approveLibrary/etc. 
// return a single library. If i pass LibraryResponse (a single-object schema) 
// to respondWith for the list route, .parse() will throw immediately since an
// array isn't a match for an object schema. i need a wrapped variant for the list endpoint:

export const LibraryListResponse = z.array(LibraryResponse);
export const UpdateLibraryInput = CreateLibraryInput.partial();
export const PublicLibraryListResponse = z.array(PublicLibraryResponse);
export const OwnerLibraryListResponse = z.array(OwnerLibraryResponse);
