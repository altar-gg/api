const jwt = require("jsonwebtoken");

module.exports = (app) => {
	return {
		get: {
			preHandler: [app.auth(["basic"])],
			handler: async (request, reply) => {

				let session = jwt.sign({
					who: request.account.id,
					for: ["regular usage"]
                    
				}, process.env.SESSION_SECRET_KEY, {
					issuer: "altar.gg",
					expiresIn: "2 days"
				});

				reply.send({session});
			}
		}
	};
};
