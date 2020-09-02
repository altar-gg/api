const _ = require("lodash");

module.exports = (app) => {
	const Account = app.mongoose.model("account");
	
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},
			
			handler: async (request, reply) => {
				let {account, params: {slug}} = request;

				if (slug === "*") {
					// TODO: impl permission check for viewing all users.
					return reply.send(await Account.find({}).lean());
				}
                
				if (account.username === slug) slug = "me";         
				if (slug === "me") return reply.send(account.toJSON({visibility: "personal"}));

				await Account.findOne({username: slug}).exec().then(found => {
					if (!found) return reply.fail("account doesn't exist", 404);
					return reply.send(found.toJSON());
				});
			}
		},

		post: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},

			schema: {
				body: {
					type: "object",
					additionalProperties: false,
					properties: {
						username: { type: "string" },
						password: { type: "string" },
						email: { type: "string" }
					}
				}
			},

			handler: async (request, reply) => {
				let {account, params: {slug}, body} = request;
                
				if (account.username === slug) slug = "me";   
				if (slug === "me") {

					_.forOwn(body, (value, key) => {
						// eslint-disable-next-line security/detect-object-injection
						account[key] = value;
					});
                    
					await account.save().then(account => {
						reply.send(account.toJSON({visibility: "personal"}));
					});
				}
			}
		},
	};
};
