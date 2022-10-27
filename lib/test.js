import test from "node:test";
import { strict as assert } from "node:assert";
import { Slowpoke } from "./slowpoke/slowpoke.js";
import bodyParser from "body-parser";

test("slowpoke should work", async (t) => {
	const slowpoke = new Slowpoke();
	slowpoke.use("*", {
		middleware: bodyParser.json(),
	});

	await slowpoke.listen({
		port: 3000,
		callback: () => {
			slowpoke.logger.info("Server started at 3000");
		},
	});

	slowpoke.get("/get", {
		handler: (req, res) => {
			res.statusCode = 200;
			res.text("ok!");
		},
		schema: {
			query: {
				type: "object",
				properties: {
					success: {
						type: "boolean",
						const: true,
					},
				},
			},
		},
	});

	await t.test(
		"get request to '/get' should return 'ok!' and status code 200",
		async (t) => {
			const response = await fetch(
				"http://127.0.0.1:3000/get"
			);
			assert.equal(response.status, 200);
			assert.deepEqual(await response.text(), "ok!");
		}
	);
	await t.test(
		"get request to '/get' should return 'ok!' and status code 200 when queystring 'success=true'",
		async (t) => {
			const response = await fetch(
				"http://127.0.0.1:3000/get?success=true"
			);
			assert.equal(response.status, 200);
			assert.deepEqual(await response.text(), "ok!");
		}
	);

	await t.test(
		"get request to '/get' should return status code 400 when queystring 'success=false'",
		async (t) => {
			const response = await fetch(
				"http://127.0.0.1:3000/get?success=false"
			);
			assert.equal(response.status, 400);
		}
	);

	slowpoke.get("/:gett", {
		handler: (req, res) => {
			res.statusCode = 200;
			res.text(req.params.gett);
		},
		schema: {
			params: {
				type: "object",
				properties: {
					gett: {
						type: "string",
						const: "gett",
					},
				},
			},
		},
	});

	await t.test(
		"get request to '/gett' should return 'gett' and status code 200",
		async (t) => {
			const response = await fetch(
				"http://127.0.0.1:3000/gett"
			);
			assert.equal(response.status, 200);
			assert.deepEqual(await response.text(), "gett");
		}
	);

	await t.test(
		"get request to '/gettt' should return status code 400",
		async (t) => {
			const response = await fetch(
				"http://127.0.0.1:3000/gettt"
			);
			assert.equal(response.status, 400);
		}
	);

	slowpoke.post("/post", {
		handler: async (req, res) => {
			res.statusCode = 200;
			res.json(req.body);
		},
		schema: {
			body: {
				type: "object",
				properties: {
					value: {
						type: "integer",
					},
					value2: {
						type: "integer",
					},
				},
				required: ["value"],
			},
		},
	});

	await t.test(
		"post request should return body and status code 200",
		async (t) => {
			const data = {
				value: 1,
				value2: 2,
			};
			const response = await fetch(
				"http://127.0.0.1:3000/post",
				{
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			assert.equal(response.status, 200);
			assert.deepEqual(await response.json(), data);
		}
	);

	await t.test(
		"post request should fail with statusCode 400",
		async (t) => {
			const data = {
				value: 1,
				value2: "str",
			};
			const response = await fetch(
				"http://127.0.0.1:3000/post",
				{
					method: "post",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			assert.equal(response.status, 400);
		}
	);

	slowpoke.put("/put", {
		handler: async (req, res) => {
			res.statusCode = 200;
			res.json(req.body);
		},
		schema: {
			body: {
				type: "object",
				properties: {
					value: {
						type: "integer",
					},
					value2: {
						type: "integer",
					},
				},
				required: ["value"],
			},
		},
	});

	await t.test(
		"put request should return body and status code 200",
		async (t) => {
			const data = {
				value: 1,
				value2: 2,
			};
			const response = await fetch(
				"http://127.0.0.1:3000/put",
				{
					method: "put",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			assert.equal(response.status, 200);
			assert.deepEqual(await response.json(), data);
		}
	);

	await t.test(
		"put request should fail with statusCode 400",
		async (t) => {
			const data = {
				value: 1,
				value2: "str",
			};
			const response = await fetch(
				"http://127.0.0.1:3000/put",
				{
					method: "put",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			assert.equal(response.status, 400);
		}
	);

	slowpoke.patch("/patch", {
		handler: async (req, res) => {
			res.statusCode = 200;
			res.json(req.body);
		},
		schema: {
			body: {
				type: "object",
				properties: {
					value: {
						type: "integer",
					},
					value2: {
						type: "integer",
					},
				},
				required: ["value"],
			},
		},
	});

	await t.test(
		"patch request should return body and status code 200",
		async (t) => {
			const data = {
				value: 1,
				value2: 2,
			};
			const response = await fetch(
				"http://127.0.0.1:3000/patch",
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			assert.equal(response.status, 200);
		}
	);

	await t.test(
		"patch request should fail with statusCode 400",
		async (t) => {
			const data = {
				value: 1,
				value2: "str",
			};
			const response = await fetch(
				"http://127.0.0.1:3000/patch",
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				}
			);
			assert.equal(response.status, 400);
		}
	);

	slowpoke.delete("/delete/:id", {
		handler: async (req, res) => {
			res.statusCode = 200;
			res.json(req.params.id);
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

	await t.test(
		"delete request should return id and status code 200",
		async (t) => {
			const response = await fetch(
				"http://127.0.0.1:3000/delete/1",
				{
					method: "delete",
				}
			);
			assert.equal(response.status, 200);
			assert.deepEqual(await response.json(), 1);
		}
	);

	await t.test(
		"delete request should fail with statusCode 400",
		async (t) => {
			const response = await fetch(
				"http://127.0.0.1:3000/delete/one",
				{
					method: "delete",
				}
			);
			assert.equal(response.status, 400);
		}
	);

	slowpoke.close(() => {
		console.log("tests are finished");
	});
});
