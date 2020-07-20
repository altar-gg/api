const cluster = require('cluster');
const debug = require("debug");
const os = require('os');

const development = process.env.NODE_ENV === "development";
if (!development) process.env.NODE_ENV = "production";

development ? debug.enable("*") : process.env.NODE_ENV = "production";
const log = debug("master");

const config = Object.assign({
    hostname: "localhost",
    port: 80,

    captcha: {
        public: "",
        private: ""
    },

    request_timeout: 5000

}, require(`../${process.env.NODE_ENV}.config.js`));

function fork(old_worker) {
    if (old_worker && old_worker.id) {
        log(`Worker #${old_worker.id} died.`)
    }

    let worker = cluster.fork();
    log(`Created worker #${worker.id}.`);
}

if (cluster.isMaster) {
    log(`Attempting to host on ${config.hostname}:${config.port}.`);

    if (development) return fork();
    os.cpus().forEach(fork);
    
} else {
    const context = {development, cluster, ...config};
	require("./app.js")(context)
}

cluster.on("exit", fork);
