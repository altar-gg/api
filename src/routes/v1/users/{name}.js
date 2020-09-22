const _ = require("lodash");

module.exports = (app) => {
	const User = app.mongoose.model("user");
	
	return {
		/* get another user by name */
		get: {
			config: {
				middleware: ["authentication"],
				authentication: {
					methods: ["bearer"],
					optional: true
				}
			},
			
			handler: async (request, reply) => {
				let {user, params: {name}} = request;

				let self = name === user?.name;
				let promise = self ? Promise.resolve(user) :  User.fromName(name).exec(); 
				await promise.then(async found => {
					if (!found) return reply.fail("user doesn't exist", 404);

					return reply.send(found.toJSON({
						show: self ? "personal" : undefined
					}));
				});
			}
		},

		/* update another user */
		post: {
			config: {
				middleware: ["authentication"],
				authentication: {methods: ["bearer"]}
			},

			schema: {
				body: {
					type: "object",
					additionalProperties: false,
					properties: {
						name: { type: "string" },
						password: { type: "string" },
						email: { type: "string" }
					}
				}
			},

			handler: async (request, reply) => {
				let {user, params: {name}, body} = request;
                
				if (user.name === name) name = "me";   
				if (name === "me") {

					_.forOwn(body, (value, key) => {
						// eslint-disable-next-line security/detect-object-injection
						user[key] = value;
					});
                    
					await user.save().then(user => {
						reply.send(user.toJSON({visibility: "personal"}));
					});
				}
			}
		},
	};
};
