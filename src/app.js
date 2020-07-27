const mongoose = require("mongoose");
const express = require("express");
const debug = require("debug");
require("@altar-gg/schemas");

module.exports = function(context) {

    context.mongoose = mongoose;
    context.express = express;

    context.log = debug(`worker:${context.cluster.worker.id}`);

    context.log("Connecting to MongoDB...");
    mongoose.connect(context.mongodb.url, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        dbName: context.mongodb.name
    }).then(() => {
        let connection = mongoose.connection;

        context.log("Connected to MongoDB.");
        context.log(`Using database: ${connection.name}.`);

        context.app = express();
        const app = context.app;

        app.use(express.json());

        require("./routes/")(context);
        
        app.listen({port: context.port, host: context.hostname}, () => {
            context.log(`Ready and listening.`);
        });

    }).catch(error => {
        context.log(error.message);
        context.cluster.worker.disconnect();
    });
}
