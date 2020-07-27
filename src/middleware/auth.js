const mongoose = require("mongoose");
const passport = require("passport");

passport.use(new require("passport-http").BasicStrategy (
    function(username, password, done) {
        console.log({username, password})
        done(null, false);
    }
));

module.exports = function (options) {
    if (typeof options === "boolean") options = {deny_logged_in: !options};

    options = Object.assign({
        deny_logged_in: false
    }, options);

    return async function (req, res, next) {

        passport.authenticate('basic', function (error, user, info) {
            if (error) return res.error(error.message, 401);

            if (!user) return res.error("invalid credentials", 401);
            if (options.deny_logged_in) return res.error("already logged in", 403);

            console.log({user, info});
            next();

        }, { session: false })(req, res, next)
    }
}
