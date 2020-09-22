module.exports = (app) => {
	const Member = app.mongoose.model("member");
	const User = app.mongoose.model("user");
	
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},

			handler: async ({user}, reply) => {
				reply.redirect(`/v1/users/${user.name}`);
			}
		},

		/* create a new user */
		post: {
			schema: {
				body: {
					type: "object",
					additionalProperties: false,
					properties: {
						name: { type: "string" },
						password: { type: "string" },
						email: { type: "string" }
					}
				}
			},

			handler: async (request, reply) => {
				let {name, email} = request.body;
				let existing = await Member.findOne({$or: [{name}, {email}]}).lean();

				if (existing) {
					return reply.fail({
						message: "user validation failed",
						multiple: ["`name` or `email` already in use."]
					}, 409);
				}

				await User.create(request.body)
					.then(user => reply.send(user.toJSON({show: "personal"})))
					.catch(error => reply.fail(error));
			}
		},
	};
};
