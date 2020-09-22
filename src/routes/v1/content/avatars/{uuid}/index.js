module.exports = () => {
	return {
		get: {
			handler: async (request, reply) => {
				reply.fail(null, 404, true);
			}
		}
	};
};
