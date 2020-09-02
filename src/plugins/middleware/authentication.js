const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");

module.exports = async (app) => {
	const Account = app.mongoose.model("account");

	const types = {
		basic: (tag) => {
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
		},

		bearer: (tag) => {
			return new Promise ((resolve, reject) => {
				let json = jwt.verify(tag, process.env.SESSION_SECRET_KEY);
	
				Account.findOne({_id: json.who}).exec().then(async account => {
					if (!account) return reject("account doesn't exist");
					//	if (!account.sessions.includes(tag)) return reject();
	
					resolve(account);
				});
			});
		}
	};

	app.middleware["authentication"] = ({methods}) => {
		return async (request, reply) => {
			reply.header("WWW-Authenticate", `${_.capitalize(types[0])} realm="altar", charset="UTF-8"`);
            
			if (!request.headers.authorization) return reply.fail("missing authorization header", 401);
			let array = request.headers.authorization.split(" ");
    
			let method = array.shift(1).toLowerCase();
			let tag = array.join(" ");

			if (!methods.includes(method)) return reply.fail("unsupported authorization method");
            
			// eslint-disable-next-line security/detect-object-injection
			let account = await types[method](tag).catch((error) => {
				return reply.fail(error ? error : "authorization failed", 401);
			});
    
			if (account.disabled) return reply.fail("account disabled", 403);
			request.account = account;
		};
	};
};

module.exports.name = "authentication";
module.exports.dependencies = ["mongoose", "middleware"];
module.exports.autoConfig = {};

module.exports[Symbol.for("skip-override")] = true;
