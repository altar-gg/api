module.exports = (app) => {
	const Account = app.mongoose.model("account");
	
	return {
		get: {
			preHandler: [app.auth(["bearer"])],
			handler: async ({account}, reply) => {
				reply.send(account.toJSON({visibility: "personal"}));
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

			handler: async (request, reply) => {
				let {username, email} = request.body;
				let existing = await Account.findOne({$or: [{username}, {email}]}).lean();

				if (existing) {
					return reply.fail({
						message: "account validation failed",
						multiple: ["`username` or `email` already in use."]
					}, 409);
				}

				await Account.create(request.body)
					.then(account => reply.send(account.toJSON({visibility: "personal"})))
					.catch(error => reply.fail(error));
			}
		},
	};
};
