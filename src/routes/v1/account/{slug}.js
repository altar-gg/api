module.exports = (app) => {
	const Account = app.mongoose.model("User");
	const PublicAccount = app.mongoose.model("PublicUser");

	return {
		get: {
			handler: (request, reply) => {
				let {slug} = request.params;
				let key = slug.length === 36 ? "id" : "username";

				Account.findOne({[key]: slug}).exec().then(account => {
					if (!account) return reply.fail("account doesn't exist", 404);
					reply.send(new PublicAccount(account));
				});
			}
		}
	};
};
