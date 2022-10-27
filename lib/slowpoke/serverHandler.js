import { validate } from "./validate.js";
import { processMiddlewares } from "./middleware.js";
import { slowpokeReqest } from "./request.js";
import { slowpokeResponse } from "./response.js";

export const serverHandler = (routes, logger) => {
	return async function (req, res) {
		try {
			req = slowpokeReqest(req);
			res = slowpokeResponse(res);
			const method = req.method;
			const path = req.path;
			const middlewaresToProcess = [];
			let handler = null;
			let validator = null;
			for (const [matchFunction, descriptor] of routes) {
				const matchFunctionResult = matchFunction(path);
				const splitedPath = path.split(/(?=\/)/);
				let partialUrl = "";
				for (const spilt of splitedPath) {
					partialUrl += spilt;
					if (
						matchFunction(partialUrl) &&
						descriptor.middlewares.length
					) {
						middlewaresToProcess.push(
							...descriptor.middlewares
						);
					}
				}
				if (matchFunctionResult && descriptor[method]) {
					({ handler, validator } = descriptor[method]);

					middlewaresToProcess.push(
						...descriptor[method].middlewares
					);
					req.params = matchFunctionResult.params;
					break;
				}
			}
			if (!handler) {
				res.statusCode = 404;
				res.text(`Not Found`);
				return;
			}
			try {
				if (middlewaresToProcess.length) {
					await processMiddlewares(
						middlewaresToProcess,
						req,
						res
					);
				}
				if (validator) {
					const { valid, errors } = validate(
						validator,
						req
					);
					if (!valid) {
						const error = new Error(errors);
						error.statusCode = 400;
						throw error;
					}
				}
				handler(req, res);
			} catch (e) {
				if (e.statusCode) {
					res.statusCode = e.statusCode;
					res.text(e.message);
				} else {
					throw e;
				}
			}
		} catch (e) {
			res.statusCode = 500;
			logger.error(e);
			res.text(`Server Error`);
		}
	};
};
