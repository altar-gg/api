const plugin = require("fastify-plugin");
const autoroutes = require("fastify-autoroutes");

module.exports = plugin(async function (app) {
    
	app.register(autoroutes, {
		dir: "./routes"
	});

}, {name: "routes", dependencies: ["mongoose", "errors", "security"]});
