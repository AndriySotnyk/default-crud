let database = null;

const init = async () => {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (database === null) {
				database = {
					users: [
						{
							id: 1,
							login: "admin",
							password: "passwordHash",
						},
					],
				};
			}
			resolve(true);
		}, 10);
	});
};
const crud = (table) => {
	return {
		read(id) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					let result;
					if (id) {
						result = database[table].find(
							(user) => user.id === id
						);
					} else {
						result = database[table];
					}
					resolve(result);
				}, 5);
			});
		},

		create({ ...record }) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					record.id = database[table].at(-1).id + 1;
					database[table].push(record);
					resolve(record);
				}, 5);
			});
		},

		update(id, { ...record }) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					const idx = database[table].findIndex(
						(user) => user.id === id
					);
					if (idx === -1) {
						resolve(idx);
					}
					record.id = id;
					database[table][idx] = record;
					resolve(record);
				}, 5);
			});
		},

		delete(id) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					const idx = database[table].findIndex(
						(user) => user.id === id
					);
					if (idx === -1) {
						resolve(idx);
					}
					database[table].splice(idx, 1);
					resolve(true);
				}, 5);
			});
		},
	};
};

const db = { init, crud };

export { init, crud };

export default db;
