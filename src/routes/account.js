module.exports = function (context) {
    const app = context.express();

    /* 
        POST /v1/account/
        RATELIMIT, CAPTCHA, NO_AUTH

        Create new account.
    */
    app.post("/", async (req, res) => {
        res.json({});        
    });

    /* 
        GET /v1/account/
        AUTHED, FLAG("VIEW_SELF")

        Obtain currently logged in account.
    */
    app.get("/", async (req, res) => {
        res.json({});
    });

    /* 
        GET /v1/account/edit/
        AUTHED, FLAG("MODIFY_SELF"), CAPTCHA

        Modify currently logged in account.
    */
    app.get("/edit/", async (req, res) => {
        res.json({});
    });

    /* 
        DELETE /v1/account/
        AUTHED, FLAG("DELETE_SELF"), CAPTCHA

        Delete current account.
    */
    app.delete("/", async (req, res) => {
        res.json({});        
    });

    /* 
        GET /v1/account/:id/
        AUTHED, RATELIMIT

        Get another user account.
    */
    app.get("/:id/", async (req, res) => {
        res.json({});        
    });

    /* 
        GET /v1/account/:id/
        AUTHED, FLAG("MODIFY_OTHER_ACCOUNTS"), CAPTCHA

        Modify another user account.
    */
    app.get("/:id/edit/", async (req, res) => {
        res.json({});        
    });

    /* 
        DELETE /v1/account/:id/
        AUTHED, FLAG("DELETE_OTHER_ACCOUNTS"), CAPTCHA

        Delete another user account.
    */
    app.get("/:id/", async (req, res) => {
       res.json({});        
    });
   
    return app;
}