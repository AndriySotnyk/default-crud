export const slowpokeResponse = (res) => {
	res.json = (content) => {
		if (typeof content !== "string") {
			content = JSON.stringify(content);
		}
		res.setHeader("Content-length", content.length);
		res.setHeader("Content-Type", "application/json");
		res.end(content);
	};

	res.text = (content) => {
		if (typeof content !== "string") {
			content = JSON.stringify(content);
		}
		res.setHeader("Content-length", content.length);
		res.setHeader("Content-Type", "text/html");
		res.end(content);
	};

	return res;
};
