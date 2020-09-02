const helmet = require("fastify-helmet");
const cors = require("fastify-cors");

module.exports = async function (app) {

	app.register(helmet, {});
	app.register(cors, {
		origin: [/\.altar\.gg$/]
	});
    
};

module.exports.name = "security";
module.exports[Symbol.for("skip-override")] = true;