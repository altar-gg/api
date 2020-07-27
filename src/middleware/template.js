module.exports = function (options = {}) {
    options = Object.assign({}, options);

    return async function (req, res, next) {
        next();
    }
}
