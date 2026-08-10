export default function respondWith(schema) {
	return (req, res, next) => {
		const originaJson = res.json.bind(res);

		res.json = (body) => {
			if (body?.data) {
				body.data = schema.parse(body.data);
			}
			return originaJson(body);
		};
		next();
	};
}
