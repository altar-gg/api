const jwt = require("jsonwebtoken");

module.exports = () => {
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["basic"]}
			},

			handler: async (request, reply) => {
				const body = {who: request.user.id};
				const options = {expiresIn: "2 days"};

				let session = jwt.sign(body, process.env.SESSION_SECRET_KEY, options);
				reply.send({session});
			}
		}
	};
};
