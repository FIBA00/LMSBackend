export default function inputValidationBody(schema) {
	return (req, res, next) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return res.status(422).json({
				success: false,
				message: "Validation failed",
				errors: result.error.flatten(),
			});
		}
		// now typed/cleaned, same idea as FASTAPIS parsed model
		req.body = result.data;
		next();
	};
}
