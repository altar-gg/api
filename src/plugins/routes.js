const autoroutes = require("fastify-autoroutes");

module.exports = async function (app) {
	app.register(autoroutes, {
		dir: "./routes"
	});
};

module.exports.name = "routes";
module.exports.dependencies = ["mongoose", "errors", "security"];
module.exports.autoConfig = {};

module.exports[Symbol.for("skip-override")] = true;