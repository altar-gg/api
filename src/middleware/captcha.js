const fetch = require("node-fetch");
module.exports = function (options) {

    const url = "https://www.google.com/recaptcha/api/siteverify";
    const fetch_options = {method: "POST"};

    return async function (req, res, next) {

        if (req.context.development) {
            return next();
        }

        let fetch_url = url + `?secret=${req.context.captcha.private}&response=${req.body.captcha}`;
        fetch(fetch_url, fetch_options).then(async response => {
            let json = await response.json();
            if (json.success) return next();

            return res.error("failed captcha", 400, {codes: json["error-codes"]});

        }).catch(error => {
            return res.error(error.message);
        });
    }
}
