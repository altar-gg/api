module.exports = () => {
	return {
		get: {
			handler: async (request, reply) => {
				reply.send(process.env);
			}
		}
	};
};
