module.exports = (app) => {
	const Member = app.mongoose.model("member");
	const Team = app.mongoose.model("team");
	
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},

			handler: async (request, reply) => {
				reply.send("not implemented", 500);
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
						name: { type: "string" },
						display: { type: "string" }
					}
				}
			},

			handler: async ({body, user}, reply) => {
				if (await Member.fromName(body.name, false).lean()) {
					return reply.fail({
						message: "team validation failed",
						multiple: ["`name` already in use."]
					}, 409);
				}

				if (!body.display) body.display = body.name;
				body.owner = user.id;
				
				let team = await Team.create(body).catch(error => reply.fail(error));

				team.members.push({id: user.id});
				team.markModified("members");
				team = await team.save();

				reply.send(team.toJSON());
			}
		},
	};
};
