module.exports = (app) => {
	const Member = app.mongoose.model("member");
	
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},
			
			handler: async (request, reply) => {
				return reply.send(await Member.find({}).lean());
			}
		}
	};
};
