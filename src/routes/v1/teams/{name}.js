module.exports = (app) => {
	const Team = app.mongoose.model("team");
	
	return {
		/* get another team by name */
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},
			
			handler: async (request, reply) => {
				let {params: {name}} = request;

				await Team.fromName(name).exec().then(found => {
					if (!found) return reply.fail("team doesn't exist", 404);
					return reply.send(found.toJSON());
				});
			}
		},

		/* update another team */
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
						password: { type: "string" },
						email: { type: "string" }
					}
				}
			},

			handler: async (request, reply) => {
				reply.send("not implemented", 500);
			}
		},
	};
};
