import { parse } from "node:querystring";

export const slowpokeReqest = (req) => {
	const [path, queryString] = req.url.split("?");
	req.path = path;
	req.query = parse(queryString);
	return req;
};
