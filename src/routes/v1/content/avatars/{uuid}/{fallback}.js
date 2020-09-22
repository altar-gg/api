const fetch = require("node-fetch");

function create_svg_fallback(name, background = "#000000") {
	const font_size = 50;

	const initials = name.slice(0, 2).toUpperCase();

	let svg = `
	<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate;" viewBox"0 0 1 1" version="1.1">
		<rect width="1" height="1" fill="${background}"></rect>
		<text x="50%" y="50%" style="font-family: Arial,sans-serif; font-size: ${font_size / 100}px" fill="#FFF" text-anchor="middle" dy=".178">${initials}</text>
	</svg>`;

	return svg;
}

module.exports = () => {
	return {
		get: {
			handler: async (request, reply) => {
				let {params: {fallback}} = request;
				fallback = fallback.split(".")[0];

				//let response = await fetch(`https://avatars.dicebear.com/api/initials/${fallback}.svg`);
				//reply.type(response.headers.get("content-type"));
				//reply.send(response.body);

				let svg = create_svg_fallback(fallback);

				reply.type("image/svg+xml");
				reply.send(svg);
			}
		}
	};
};
