const cors = require("../middleware/cors");
const errors = require("../middleware/errors");
const timeout = require("../middleware/timeout");
const catch_error = require("../middleware/catch_error");
const not_found = require("../middleware/not_found");

module.exports = function (context) {
    const app = context.app;

    app.use((req, res, next) => {
        req.context = context;
        next();
    });

    app.use(errors);
    app.use(timeout);
    app.use(cors);

    app.use("/v1/users/", require("./users")(context));

    app.use(not_found);
    app.use(catch_error);
}