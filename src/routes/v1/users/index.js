module.exports = (app) => {
	const User = app.mongoose.model("user");
	
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},
			
			handler: async (request, reply) => {
				return reply.send(await User.find({}).lean());
			}
		}
	};
};
