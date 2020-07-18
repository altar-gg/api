module.exports = function (req, res, next) {
    res.error = function (message, code = 400, content = {}) {
        if (res.headersSent) return;
        if (typeof code !== "number") {
            content = code;
            code = 400;
        }

        res.json({error: {message, ...content}}).status(code);
    }

    next();
}
