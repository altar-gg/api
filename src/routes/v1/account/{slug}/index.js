const _ = require("lodash");

module.exports = (app) => {
	const Account = app.mongoose.model("account");
	
	return {
		get: {
			preHandler: [app.auth(["bearer"])],
			handler: async (request, reply) => {
				let {account, params: {slug}} = request;

				if (slug === "*") {
					// TODO: impl permission check for viewing all users.
					return reply.send(Account.find({}).lean());
				}
                
				if (account.username === slug) slug = "me";         
				if (slug === "me") return reply.send(account.toJSON({visibility: "personal"}));

				Account.findOne({username: slug}).exec().then(found => {
					if (!found) return reply.fail("account doesn't exist", 404);
					reply.send(found.toJSON());
				});
			}
		},

		post: {
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

			preHandler: [app.auth(["bearer"])],
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
