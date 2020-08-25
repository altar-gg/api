module.exports = (app) => {
	const Account = app.mongoose.model("account");
	
	return {
		get: {
			preHandler: [app.auth(["bearer"])],
			handler: async (request, reply) => {
				reply.send(request.account.toJSON({visibility: "personal"}));
			}
		},

		post: {
			handler: async (request, reply) => {
				let {username, email} = request.body;
				let existing = await Account.findOne({$or: [{username}, {email}]}).lean();

				if (existing) {
					return reply.fail({
						message: "account validation failed",
						multiple: ["`username` or `email` already in use."]
					});
				}

				Account.create(request.body).then(account => {
					reply.send(account.toJSON({visibility: "personal"}));

				}).catch(reply.fail.bind(this));
			}
		},
	};
};
