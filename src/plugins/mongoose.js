const plugify = require("fastify-plugin");
const mongoose = require("mongoose");

//console.log(require("@altar-gg/schemas"));
const schemas = require("../../../schemas");

const plugin = async (app, opts) => {

	app.decorate("mongoose", mongoose);
	schemas.bind(mongoose);
	
	mongoose.connect(opts.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
    
	mongoose.connection.on("error", (err) => {
		app.log.error(err);
		process.exit(1);
	});
    
	mongoose.connection.once("open", () => {
		app.log.info("mongoose connected");
	});
};

plugin.autoConfig = {
	url: process.env.MONGOOSE_URL
};

module.exports = plugify(plugin, {name: "mongoose"});
