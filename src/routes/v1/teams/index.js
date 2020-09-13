module.exports = (app) => {
	const Team = app.mongoose.model("team");
	
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},
			
			handler: async (request, reply) => {
				return reply.send(await Team.find({}).lean());
			}
		}
	};
};
