module.exports = function (req, res, next) {
    next(new Error("not found"));
}