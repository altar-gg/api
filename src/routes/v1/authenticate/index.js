module.exports = (app) => {
	return {
		get: {
			preHandler: [app.auth(["basic"])],
			handler: async (request, reply) => {
				if (!request.account) reply.fail("invalid authentication");
				reply.send({session: ""});
			}
		}
	};
};
