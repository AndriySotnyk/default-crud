import * as dotenv from "dotenv";
dotenv.config();
export default {
	DEV: {
		host: process.env.DEV_HOST,
		port: process.env.DEV_PORT,
	},
	PROD: {},
	TEST: {
		host: process.env.TEST_HOST,
		port: process.env.TEST_PORT,
	},
};
