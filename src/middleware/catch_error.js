module.exports = function (error, req, res, next) {
    res.error(error.message, {...error});
    res.end();
}
