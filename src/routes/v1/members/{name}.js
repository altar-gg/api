module.exports = (app) => {
	const Member = app.mongoose.model("member");
	
	return {
		get: {
			handler: async ({params: {name}}, reply) => {
				let member = await Member.fromName(name, false).lean();
				if (!member) return reply.fail("member not found", 404);

				return reply.redirect(`/v1/${member.type}s/${name}`);
			}
		}
	};
};
