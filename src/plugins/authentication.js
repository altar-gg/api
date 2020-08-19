const plugify = require("fastify-plugin");
const _ = require("lodash");

const plugin = async (app) => {
	const Account = app.mongoose.model("User");

	const auth_decorate = function (types = ["basic"], realm = "altar") {
		if (!_.isArray(types)) types = [types];

		types.forEach(type => {
			if (!_.isFunction(app.auth[type])) {
				app.log.error("invalid authentication type");
				return process.exit(1);
			}
		});
        
		return async (request, reply) => {
			reply.header("WWW-Authenticate", `${_.capitalize(types[0])} realm="${realm}", charset="UTF-8"`);
            
			if (!request.headers.authorization) return reply.fail("missing authorization header", 401);
			let array = request.headers.authorization.split(" ");

			let type = _.lowerCase(array.shift(1));
			let tag = array.join(" ");
            
			if (!_.isFunction(app.auth[type])) return reply.fail("invalid authorization type");
			request.account = await app.auth[type](tag, request, reply).catch(() => {
				return reply.fail("invalid authorization");
			});
		};
		
	};

	auth_decorate.basic = (tag) => {
		return new Promise ((resolve, reject) => {
			tag = Buffer.from(tag, "base64").toString("utf-8");
			
			let array = tag.split(":");

			let key = _.lowerCase(array.shift(1));
			let type = key.includes("@") ? "email" : "username";
			let password = array.join(":");

			Account.findOne({[type]: key, password}).exec().then(account => {
				if (!account) reject();
				return resolve(account);

			}).catch(reject);
		});
	},
    
	app.decorate("auth", auth_decorate);
};

plugin.autoConfig = {};
module.exports = plugify(plugin, {name: "authentication", dependencies: ["mongoose"]});
