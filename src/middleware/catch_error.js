module.exports = function (context) {
    context.app.use((error, req, res, next) => {
        res.error(error.message, {...error});
    });
}