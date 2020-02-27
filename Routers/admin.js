const express = require("express");
const adminRouter = express.Router();
adminRouter.get("/profile",(request,response,next) =>{
    if(request.session.role == "admin")
    {
        response.render("adminProfile");
        next();
    }
    else
        response.redirect("/login");
});
module.exports = adminRouter;