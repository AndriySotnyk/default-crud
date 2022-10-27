export const validate = (validator, data) => {
	const valid = validator(data);
	let errors = "";
	if (!valid) {
		const errorsArray = [];
		validator.errors.forEach((err) => {
			errorsArray.push(err.message + "\n");
		});
		errors = errorsArray.join();
	}
	return { valid, errors };
};
