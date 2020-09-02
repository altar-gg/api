module.exports = async function (app) {

	function make (error) {
		let message = error.message;
		if (typeof error === "string") message = error;
		error = JSON.parse(JSON.stringify(error));

		if (error._message) message = error._message;
		message = message.toLowerCase();

		let multiple = error.errors ? [] : error.multiple;
		if (error.errors) {

			// Mongoose validation errors.
			Object.keys(error.errors).forEach(key => {
				// eslint-disable-next-line security/detect-object-injection
				let properties = error.errors[key].properties;
				multiple.push(properties.message.split("Path ").join(""));
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

	app.decorateReply("fail", function (error, status = 400) {
		if (this.sent) return;
		
		if (error.statusCode) this.code(error.statusCode);
		if (status) this.code(status);

		this.send(make(error));
		this.raw.end();
	});
    
	app.setErrorHandler((error, request, reply) => {
		reply.fail(error);
	});
    
	app.setNotFoundHandler({
		preHandler: (request, reply, done) => {
			reply.send(make("Not found"));
			reply.code(404);
            
			done();
		}
	});
};

module.exports.name = "errors";
module.exports.dependencies = [];
module.exports.autoConfig = {};

module.exports[Symbol.for("skip-override")] = true;
