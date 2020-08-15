import fastify from "fastify";
import helmet from "fastify-helmet";
import cors from "fastify-cors";

const app = fastify({logger: true});

app.register(helmet, {});
app.register(cors, {
	origin: [/\.altar\.gg$/]
});

app.get("/", async () => {
	return {hello: "world"};
});

app.listen(3000, "0.0.0.0", function (err, address) {
	if (err) {
		app.log.error(err);
		process.exit(1);
	}
	app.log.info(`server listening on ${address}`);
});