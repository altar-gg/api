const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

module.exports = async (app) => {
	const User = app.mongoose.model("user");

	const types = {
		basic: (tag) => {
			return new Promise ((resolve, reject) => {
				tag = Buffer.from(tag, "base64").toString("utf-8");
				let array = tag.split(":");
	
				let name = array.shift(1).toLowerCase();
				let password = array.join(":");
	
				User.fromName(name).exec().then(async user => {
					if (!user) return reject("user not found");
	
					bcrypt.compare(password, user.password).then((success) => {
						if (!success) return reject("invalid password");
						resolve(user);
					});
	
				}).catch(reject);
			});
		},

		bearer: (tag) => {
			return new Promise ((resolve, reject) => {
				let json = jwt.verify(tag, process.env.SESSION_SECRET_KEY);
	
				User.fromUUID(json.who).exec().then(async user => {
					if (!user) return reject();
					//	if (!user.sessions.includes(tag)) return reject();
	
					resolve(user);
				});
			});
		}
	};

	app.middleware["authentication"] = ({methods, optional}) => {
		return async (request, reply) => {
			reply.header("WWW-Authenticate", `${_.capitalize(types[0])} realm="altar", charset="UTF-8"`);
            
			if (!request.headers.authorization) {
				if (!optional) return reply.fail("missing authorization header", 401);
				return;
			}

			let array = request.headers.authorization.split(" ");
    
			let method = array.shift(1).toLowerCase();
			let tag = array.join(" ");

			if (!methods.includes(method)) return reply.fail("unsupported authorization method");
            
			// eslint-disable-next-line security/detect-object-injection
			let user = await types[method](tag).catch((error) => {
				return reply.fail(error ? error : "authorization failed", 401);
			});

			if (user.disabled) return reply.fail("user disabled", 403);
			request.user = user;
		};
	};
};

module.exports.name = "authentication";
module.exports.dependencies = ["mongoose", "middleware"];
module.exports.autoConfig = {};

module.exports[Symbol.for("skip-override")] = true;
