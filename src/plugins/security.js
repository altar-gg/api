const plugin = require("fastify-plugin");
const helmet = require("fastify-helmet");
const cors = require("fastify-cors");

module.exports = plugin(async function (app) {

	app.register(helmet, {});
	app.register(cors, {
		origin: [/\.altar\.gg$/]
	});
    
}, {name: "security"});
