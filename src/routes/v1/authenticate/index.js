const jwt = require("jsonwebtoken");

module.exports = () => {
	return {
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["basic"]}
			},

			handler: async (request, reply) => {
				console.log("reached handler");
				const body = {who: request.account.id};

				let session = jwt.sign(body, process.env.SESSION_SECRET_KEY, {
					expiresIn: "2 days"
				});

				reply.send({session});
			}
		}
	};
};
