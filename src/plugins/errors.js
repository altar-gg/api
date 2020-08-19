/* eslint-disable no-prototype-builtins */

const plugin = require("fastify-plugin");
const _ = require("lodash");

module.exports = plugin(async function (app) {

	function make (error) {

		let message = error.message;
		if (_.isString(error)) message = error;
		error = JSON.parse(JSON.stringify(error));

		if (error._message) message = error._message;
		message = message.toLowerCase();

		let multiple = error.errors ? [] : error.multiple;
		if (error.errors) {

			// Mongoose validation errors.
			Object.keys(error.errors).forEach(key => {
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

	app.decorateReply("fail", function (error, status) {
		if (error.statusCode) this.code(error.statusCode);
		if (status) this.code(status);

		this.send(make(error));
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
}, {name: "errors"});
