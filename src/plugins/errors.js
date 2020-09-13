module.exports = async function (app) {

	function make (error) {
		let message = error.message;
		if (typeof error === "string") message = error;
		error = JSON.parse(JSON.stringify(error));

		if (error?._message) message = error._message;
		message = message.toLowerCase() || "an unknown error";

		let multiple = error.errors ? [] : error.multiple;
		if (error?.errors) {

			// Mongoose validation errors.
			Object.keys(error.errors).forEach(key => {
				// eslint-disable-next-line security/detect-object-injection
				let properties = error.errors[key].properties;
				if (properties?.message) multiple.push(properties.message.split("Path ").join(""));
			});
		}

		return {
			error: {
				message,
				multiple,
				//raw: error,
			}
		};
	}

	app.decorateReply("fail", function (error, status = 400, empty = false) {
		if (this.sent) return;
		
		if (error.statusCode) this.code(error.statusCode);
		if (status) this.code(status);

		if (!empty) this.send(make(error));
		if (!error && empty) {
			this.sent = true;
		}
		
		this.raw.end();
	});
    
	app.setErrorHandler((error, request, reply) => {
		reply.fail(error);
	});
    
	app.setNotFoundHandler({
		preHandler: (request, reply) => {
			reply.fail("not found", 404);
		}
	});
};

module.exports.name = "errors";
module.exports.dependencies = [];
module.exports.autoConfig = {};

module.exports[Symbol.for("skip-override")] = true;
