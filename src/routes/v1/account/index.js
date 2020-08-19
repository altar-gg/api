module.exports = (app) => {
	const Account = app.mongoose.model("User");
	const DetailedAccount = app.mongoose.model("DetailedUser");

	console.log(app.auth, app.basicAuth);

	return {
		get: {
			onRequest: app.auth(["basic"]),
			handler: async ({account}) => {
				return new DetailedAccount(account);
			}
		},

		post: {
			handler: async (request, reply) => {
				let {username, email} = request.body;
				let existing = await Account.findOne({$or: [{username}, {email}]}).lean();

				if (existing) {
					if (existing.username === username) {
						return reply.fail({
							message: "account validation failed",
							multiple: ["`username` already in use."]
						});
					}

					if (existing.email === email) {
						return reply.fail({
							message: "account validation failed",
							multiple: ["`email` already in use."]
						});
					}

					return;
				}

				let account = new Account(request.body);
				account = await account.save().catch((error) => {
					reply.fail(error);
					return;
				});

				return new DetailedAccount(account);
			}
		},
	};
};
