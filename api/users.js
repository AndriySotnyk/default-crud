import { crud } from "../db/db.js";
import { hash } from "../util/hash.js";
const users = crud("users");
export default {
	async read(id) {
		const result = users.read(id);
		return result;
	},

	async create({ login, password }) {
		const passwordHash = await hash(password);
		const result = users.create({
			login,
			password: passwordHash,
		});
		return result;
	},

	async update(id, { login, password }) {
		const passwordHash = await hash(password);
		const result = users.update(id, {
			login,
			password: passwordHash,
		});
		return result;
	},

	async delete(id) {
		const result = users.delete(id);
		return result;
	},
};
