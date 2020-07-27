module.exports = function (context) {
    const app = context.express();

    const ratelimit = require("../middleware/ratelimit");
    const captcha = require("../middleware/captcha");
    const auth = require("../middleware/auth");

    /* 
        POST /v1/account/
        RATELIMIT, CAPTCHA, NO_AUTH

        Create new account.
    */ 
    app.post("/", ratelimit({
        every: "24 hours", 
        use: "manual"
    }), captcha(), auth(false), 

    async (req, res) => {
        res.json({});        
    });

    /* 
        GET /v1/account/
        AUTHED, RATELIMIT

        Obtain currently logged in account.
    */
    app.get("/", ratelimit(), auth(), async (req, res) => {
        res.json({});
    });

    /* 
        POST /v1/account/edit/
        AUTHED, CAPTCHA, RATELIMIT

        Modify currently logged in account.
    */
    app.post("/edit/", ratelimit(), captcha(), auth(), async (req, res) => {
        res.json({});
    });

    /* 
        DELETE /v1/account/
        AUTHED, CAPTCHA

        Delete current account.
    */
    app.delete("/", captcha(), auth(), async (req, res) => {
        res.json({});        
    });

    /* 
        GET /v1/account/:id/
        AUTHED, RATELIMIT

        Get another user account.
    */
    app.get("/:id/", ratelimit(), auth(), async (req, res) => {
        res.json({});        
    });

    /* 
        POST /v1/account/:id/edit/
        AUTHED, CAPTCHA, RATELIMIT

        Modify another user account.
    */
    app.post("/:id/edit/", ratelimit(), captcha(), auth(), async (req, res) => {
        res.json({});        
    });

    /* 
        POST /v1/account/:id/report/
        AUTHED, CAPTCHA, RATELIMIT

        Report another user account.
    */
    app.post("/:id/report/", ratelimit(), captcha(), auth(), async (req, res) => {
        res.json({});        
    });

    /* 
        DELETE /v1/account/:id/
        AUTHED, CAPTCHA

        Delete another user account.
    */
    app.delete("/:id/", captcha(), auth(), async (req, res) => {
       res.json({});        
    });
   
    return app;
}
