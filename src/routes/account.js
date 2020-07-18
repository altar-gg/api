module.exports = function (context) {
    const app = context.express();

    const ratelimit = require("../middleware/ratelimit");
    const captcha = require("../middleware/captcha");
    const auth = require("../middleware/auth");
    const flag = require("../middleware/flag");

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
        AUTHED, FLAG("VIEW_SELF"), RATELIMIT

        Obtain currently logged in account.
    */
    app.get("/", ratelimit(), auth(), flag("VIEW_SELF"), async (req, res) => {
        res.json({});
    });

    /* 
        POST /v1/account/edit/
        AUTHED, FLAG("MODIFY_SELF"), CAPTCHA, RATELIMIT

        Modify currently logged in account.
    */
    app.post("/edit/", ratelimit(), captcha(), auth(), flag("MODIFY_SELF"), async (req, res) => {
        res.json({});
    });

    /* 
        DELETE /v1/account/
        AUTHED, FLAG("DELETE_SELF"), CAPTCHA

        Delete current account.
    */
    app.delete("/", captcha(), auth(), flag("DELETE_SELF"), async (req, res) => {
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
        POST /v1/account/:id/
        AUTHED, FLAG("MODIFY_OTHER_ACCOUNTS"), CAPTCHA, RATELIMIT

        Modify another user account.
    */

    
    app.post("/:id/edit/", ratelimit(), captcha(), auth(), flag("MODIFY_OTHER_ACCOUNTS"), async (req, res) => {
        res.json({});        
    });

    /* 
        DELETE /v1/account/:id/
        AUTHED, FLAG("DELETE_OTHER_ACCOUNTS"), CAPTCHA

        Delete another user account.
    */
    app.delete("/:id/", captcha(), auth(), flag("DELETE_OTHER_ACCOUNTS"), async (req, res) => {
       res.json({});        
    });
   
    return app;
}
