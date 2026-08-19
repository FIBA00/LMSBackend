export default function respondWith(schema) {
    return (req, res, next) => {
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            try {
                if (body?.data) {
                    body.data = schema.parse(body.data);
                }
            } catch (error) {
                console.log("Response validation failed:", error.message);
                return originalJson({
                    success: false,
                    message: "Server response validation failed.",
                });
            }
            return originalJson(body);
        };
        next();
    };
}
