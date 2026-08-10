import { z } from "zod";

export const UserCreate = z
	.object({
		username: z.string().trim().min(1, "user name is required !."),
		email: z.string().trim().email("Enter a valid email"),
		phone: z.string().trim().min(8, "Must be greater or equal to 8"),
		password: z
			.string()
			.trim()
			.min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string().min(1, "Please confirm your password"),
	})
	.refine(checkPasswordsMatch, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const UserProfile = z.object({
	username: z.string().trim().min(1, "User name is required !."),
	email: z.string().trim().email("Enter a valid email"),
	phone: z.string().trim().min(10, "Enter valid phone number."),
});

export const UserLogin = z.object({
	email: z.string().trim().email("Enter a valid email"),
	password: z.string().min(5, "password is required"),
});

export const UserResponse = z.object({
	id: z.number(),
	username: z.string().trim().min(5),
	email: z.string().trim().email().min(5),
	phone: z.string().trim().min(8),
	role: z.string().trim(),
});

function checkPasswordsMatch({ password, confirmPassword }) {
	return password === confirmPassword;
}
