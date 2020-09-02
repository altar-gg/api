/* eslint-disable security/detect-object-injection */

module.exports = async (app) => {

	app.decorate("middleware", {});

	app.addHook("preHandler", async (request, reply) => {
		if (!reply.context.config?.middleware) return;
		const config = reply.context.config;

		for (let i = 0; i < config.middleware.length; i++) {
			let key = config.middleware[i].toLowerCase();

			if (!app.middleware[key]) return reply.fail("invalid middleware key", 500);
			
			let middleware = await app.middleware[key](config[key]);
			await middleware(request, reply);
		}
	});
};

module.exports.name = "configs";
module.exports.dependencies = [];
module.exports.autoConfig = {};

module.exports[Symbol.for("skip-override")] = true;
