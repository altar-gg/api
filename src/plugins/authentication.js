const plugify = require("fastify-plugin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const plugin = async (app) => {
	const Account = app.mongoose.model("account");

	const auth_decorate = function (types = ["basic"]) {
		if (!_.isArray(types)) types = [types];

		types.forEach(type => {
			console.log({type})
			type = type.toLowerCase();


			// eslint-disable-next-line security/detect-object-injection
			if (!_.isFunction(app.auth[type])) {
				app.log.error("invalid authentication type uwu");
				return process.exit(1);
			}
		});
        
		return async (request, reply) => {
			reply.header("WWW-Authenticate", `${_.capitalize(types[0])} realm="altar", charset="UTF-8"`);
            
			if (!request.headers.authorization) return reply.fail("missing authorization header", 401);
			let array = request.headers.authorization.split(" ");

			let type = array.shift(1).toLowerCase();
			let tag = array.join(" ");

			// eslint-disable-next-line security/detect-object-injection
			if (!_.isFunction(app.auth[type])) return reply.fail("invalid authorization type");
			if (!types.includes(type)) return reply.fail("unsupported authorization type");

			let account = await app.auth.call(tag, request, reply).catch((error) => {
				return reply.fail(error ? error : "authorization failed", 401);
			});

			if (account.disabled) return reply.fail("account disabled", 403);
			request.account = account;
		};
		
	};

	auth_decorate.basic = (tag) => {
		return new Promise ((resolve, reject) => {
			tag = Buffer.from(tag, "base64").toString("utf-8");
			
			let array = tag.split(":");

			let key = array.shift(1).toLowerCase();
			let type = key.includes("@") ? "email" : "username";
			let password = array.join(":");

			Account.findOne({[type]: key}).exec().then(async account => {
				if (!account) return reject();

				bcrypt.compare(password, account.password).then((success) => {
					if (!success) return reject();
					resolve(account);
				});

			}).catch(reject);
		});
	};

	auth_decorate.bearer = (tag) => {
		return new Promise ((resolve, reject) => {
			let json = jwt.verify(tag, process.env.SESSION_SECRET_KEY);

			Account.findOne({_id: json.who}).exec().then(async account => {
				if (!account) return reject("account doesn't exist");
				//if (!account.sessions.includes(tag)) return reject();

				resolve(account);
			});
		});
	};
    
	app.decorate("auth", auth_decorate);
};

plugin.autoConfig = {};
module.exports = plugify(plugin, {name: "authentication", dependencies: ["mongoose"]});
