const _ = require("lodash");

module.exports = () => {
	return {
		get: {
			handler: async (request, reply) => {
				let cache = [];
				reply.send(JSON.parse(JSON.stringify(request, (key, value) => {
					if (_.isObject(value) && value !== null) {
						if (cache.includes(value)) return;
						cache.push(value);
					}
					return value;
				})));
			}
		}
	};
};
