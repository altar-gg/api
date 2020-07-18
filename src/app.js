const express = require("express");
const debug = require("debug");


module.exports = function(context) {

    context.express = express;
    context.app = express();

    context.log = debug(`worker:${context.cluster.worker.id}`);

    const app = context.app;
    app.use(express.json());

    require("./routes/")(context);
    
    app.listen({
        port: Number.parseInt(context.port), 
        host: context.hostname

    }, () => {
        context.log(`Ready and listening.`);
    });
}