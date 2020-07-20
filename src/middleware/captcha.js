const fetch = require("node-fetch");

module.exports = function (options) {

    let url = "https://www.google.com/recaptcha/api/siteverify";

    return async function (req, res, next) {

        if (req.context.development) {
            return next();
        }

        let body = {
            secret: req.context.captcha.private,
            response: req.body.captcha
        };

        fetch(url, {method: "POST", body}).then(async response => {
            let json = await response.json();
            if (json.success) {
                return next();
            }

            return res.error("failed captcha", 400, {codes: json["error-codes"]});

        }).catch(error => {
            return res.error(error.message);
        });
    }
}
