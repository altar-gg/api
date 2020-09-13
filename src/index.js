"strict mode";

// eslint-disable-next-line no-unused-vars
const dotenv = require("dotenv").config();

const fastify = require("fastify");
const autoload = require("fastify-autoload");
const path = require("path");

const app = fastify({
	logger: true,
	caseSensitive: true,
	ignoreTrailingSlash: true
});

app.register(autoload, {
	dir: path.join(__dirname, "plugins")
});

app.listen(3000, "0.0.0.0", (err) => {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}

	console.log(app.printRoutes());
});
