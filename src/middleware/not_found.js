module.exports = function (req, res, next) {
    res.error("not found", 404, {path: req.url});
}
