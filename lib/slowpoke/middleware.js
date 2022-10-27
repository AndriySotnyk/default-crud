import { validate } from "./validate.js";

export const processMiddlewares = async (
	middlewares,
	req,
	res
) => {
	for (const middlewareObject of middlewares) {
		const { middleware, validator } = middlewareObject;
		await new Promise((resolve, reject) => {
			if (validator) {
				const { valid, errors } = validate(validator, req);
				if (!valid) {
					const error = new Error(errors);
					error.statusCode = 400;
					reject(error);
				}
			}
			middleware(req, res, (e = null) => {
				return e ? reject(e) : resolve(true);
			});
		});
	}
	return;
};
