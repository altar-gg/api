module.exports = () => {
	return {
		get: {
			handler: async (request, reply) => {
				reply.redirect("/v1/");
			}
		},
	};
};
