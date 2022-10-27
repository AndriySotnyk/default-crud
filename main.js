import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { Slowpoke } from "./lib/slowpoke/slowpoke.js";
import db from "./db/db.js";
import users from "./api/users.js";
import config from "./config.js";

await db.init();

const slowpoke = new Slowpoke();

slowpoke.use("*", {
	middleware: bodyParser.json(),
});

slowpoke.get("/api/users", {
	handler: async (req, res) => {
		const result = await users.read();
		res.statusCode = 200;
		res.json(result);
	},
});

slowpoke.get("/api/users/:id", {
	handler: async (req, res) => {
		const id = req.params.id;
		const result = await users.read(id);
		if (!result) {
			res.statusCode = 404;
			res.end("Not Found");
			return;
		}
		res.statusCode = 200;
		res.json(result);
	},
	schema: {
		params: {
			type: "object",
			properties: {
				id: {
					type: "integer",
				},
			},
			required: ["id"],
		},
	},
});

slowpoke.post("/api/users", {
	handler: async (req, res) => {
		const body = req.body;
		const result = await users.create(body);
		res.statusCode = 200;
		res.json(result);
	},
	schema: {
		body: {
			type: "object",
			properties: {
				login: {
					type: "string",
				},
				password: {
					type: "string",
				},
			},
			required: ["login", "password"],
		},
	},
});

slowpoke.put("/api/users/:id", {
	handler: async (req, res) => {
		const id = req.params.id;
		const body = req.body;
		const result = await users.update(id, body);
		if (!result) {
			res.statusCode = 404;
			res.end("Not Found");
			return;
		}
		res.statusCode = 200;
		res.json(result);
	},
	schema: {
		params: {
			type: "object",
			properties: {
				id: {
					type: "integer",
				},
			},
			required: ["id"],
		},
		body: {
			type: "object",
			properties: {
				login: {
					type: "string",
				},
				password: {
					type: "string",
				},
			},
			required: ["login", "password"],
		},
	},
});

slowpoke.delete("/api/users/:id", {
	handler: async (req, res) => {
		const id = req.params.id;
		const result = await users.delete(id);
		res.statusCode = 204;
		res.end();
	},
	schema: {
		params: {
			type: "object",
			properties: {
				id: {
					type: "integer",
				},
			},
			required: ["id"],
		},
	},
});

function start(port) {
	return new Promise((resolve) => {
		slowpoke.listen({
			port,
			callback: () => {
				slowpoke.logger.info(
					"slowpoke started on port " + port
				);
				resolve(true);
			},
		});
	});
}

function stop() {
	return new Promise((resolve) => {
		slowpoke.close(() => {
			slowpoke.logger.info(
				"slowpoke started on port " + config.DEV.port
			);
			resolve(true);
		});
	});
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	start(config.DEV.port);
}

export { start, stop };
