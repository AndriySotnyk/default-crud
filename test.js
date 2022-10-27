import test from "node:test";
import { strict as assert } from "assert";
import config from "./config.js";
import { crud } from "./db/db.js";
import { start, stop } from "./main.js";

test("server should work", async (t) => {
	await start(config.TEST.port);
	const users = crud("users");
	const url = `http://${config.TEST.host}:${config.TEST.port}`;
	await t.test(
		"get to 'api/users' should return users and status 200",
		async (t) => {
			const usersApiUrl = url + "/api/users";
			const response = await fetch(usersApiUrl);
			const responseData = await response.json();
			assert.equal(response.status, 200);
			assert.deepEqual(responseData, await users.read());
		}
	);

	await t.test(
		"get to 'api/users/1' should return user and status 200",
		async (t) => {
			const usersApiUrl = url + "/api/users/1";
			const response = await fetch(usersApiUrl);
			const responseData = await response.json();
			assert.equal(response.status, 200);
			assert.deepEqual(responseData, await users.read(1));
		}
	);

	await t.test(
		"post to 'api/users' should return result and status 200",
		async (t) => {
			const usersApiUrl = url + "/api/users";
			const user = {
				login: "user",
				password: "password",
			};
			const response = await fetch(usersApiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});
			const responseData = await response.json();
			assert.equal(response.status, 200);
			assert.deepEqual(responseData, await users.read(2));
		}
	);

	await t.test(
		"get to 'api/users/2' should return new user and status 200",
		async (t) => {
			const usersApiUrl = url + "/api/users/2";
			const response = await fetch(usersApiUrl);
			const responseData = await response.json();
			assert.equal(response.status, 200);
			assert.deepEqual(responseData, await users.read(2));
		}
	);

	await t.test(
		"put to 'api/users/2' should return result and status 200",
		async (t) => {
			const usersApiUrl = url + "/api/users/2";
			const user = {
				login: "user2",
				password: "password",
			};
			const response = await fetch(usersApiUrl, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(user),
			});
			const responseData = await response.json();
			assert.equal(response.status, 200);
			assert.deepEqual(responseData, await users.read(2));
		}
	);

	await t.test(
		"get to 'api/users/2' should return updated user and status 200",
		async (t) => {
			const usersApiUrl = url + "/api/users/2";
			const response = await fetch(usersApiUrl);
			const responseData = await response.json();
			assert.equal(response.status, 200);
			assert.equal(responseData.login, "user2");
			assert.deepEqual(responseData, await users.read(2));
		}
	);

	await t.test(
		"delete to 'api/users/2' should delete user and status 204",
		async (t) => {
			const usersApiUrl = url + "/api/users/2";
			const response = await fetch(usersApiUrl, {
				method: "DELETE",
			});
			const responseData = await response.text();
			assert.equal(response.status, 204);
			assert.deepEqual(responseData, "");
		}
	);

	await t.test(
		"get to 'api/users/2' should return 'Not found' and status 404",
		async (t) => {
			const usersApiUrl = url + "/api/users/2";
			const response = await fetch(usersApiUrl);
			const responseData = await response.text();
			assert.equal(response.status, 404);
			assert.deepEqual(responseData, "Not Found");
		}
	);

	await stop();
});
