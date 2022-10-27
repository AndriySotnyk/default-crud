import { createServer } from "node:http";
import { match } from "path-to-regexp";
import Ajv from "ajv";
import pino from "pino";
import { serverHandler } from "./serverHandler.js";

let ajv = null;
let ajvOptions = {
	coerceTypes: true,
	allErrors: false,
	removeAdditional: false,
};

export class Slowpoke {
	constructor(options = null) {
		if (options?.logger) {
			this.logger = pino(options.logger);
		} else {
			this.logger = pino();
		}
		if (options?.ajvOptions) {
			ajvOptions = { ...options, ...ajvOptions };
		}
		ajv = new Ajv(ajvOptions);
		this.routes = new Map();
		this.server = createServer(
			serverHandler(this.routes, this.logger)
		);
	}

	async listen({
		port = 3000,
		hostname = "127.0.0.1",
		callback = () => {},
	}) {
		await this.server.listen(port, hostname);
		callback();
		return this;
	}

	async close(callback) {
		await this.server.close(callback);
	}
	setRouteDescriptor(
		path,
		{
			method,
			middleware = null,
			handler = null,
			schema = null,
		}
	) {
		if (path === "*") path = "(.*)";
		const matchFunction = match(path);
		const routeDescriptor = this.routes.has(matchFunction)
			? this.routes.get(matchFunction)
			: { middlewares: [] };
		let validator = null;
		if (schema) {
			validator = ajv.compile({
				type: "object",
				properties: schema,
			});
		}
		if (method === "USE") {
			const middlewareObject = {
				middleware,
			};
			if (validator) {
				middlewareObject.validator = validator;
			}
			routeDescriptor.middlewares.push(middlewareObject);
		} else {
			routeDescriptor[method] = routeDescriptor[method] || {
				handler: null,
				middlewares: [],
			};
			if (validator) {
				routeDescriptor[method].validator = validator;
			}
			routeDescriptor[method].handler = handler;
			if (middleware !== null) {
				routeDescriptor[method].middlewares.push({
					middleware,
				});
			}
		}
		this.routes.set(matchFunction, routeDescriptor);
		return this;
	}

	get(path, { middleware = null, handler, schema = null }) {
		this.setRouteDescriptor(path, {
			method: "GET",
			middleware,
			handler,
			schema,
		});
		return this;
	}

	post(
		path,
		{ middleware = null, handler, schema = null }
	) {
		this.setRouteDescriptor(path, {
			method: "POST",
			middleware,
			handler,
			schema,
		});
		return this;
	}

	put(path, { middleware = null, handler, schema = null }) {
		this.setRouteDescriptor(path, {
			method: "PUT",
			middleware,
			handler,
			schema,
		});
		return this;
	}

	patch(
		path,
		{ middleware = null, handler, schema = null }
	) {
		this.setRouteDescriptor(path, {
			method: "PATCH",
			middleware,
			handler,
			schema,
		});
		return this;
	}

	delete(
		path,
		{ middleware = null, handler, schema = null }
	) {
		this.setRouteDescriptor(path, {
			method: "DELETE",
			middleware,
			handler,
			schema,
		});
		return this;
	}

	options(
		path,
		{ middleware = null, handler, schema = null }
	) {
		this.setRouteDescriptor(path, {
			method: "OPTIONS",
			middleware,
			handler,
			schema,
		});
		return this;
	}

	use(path, { middleware, schema = null }) {
		this.setRouteDescriptor(path, {
			method: "USE",
			middleware,
			schema,
		});
		return this;
	}
}
