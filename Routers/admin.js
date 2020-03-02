const express = require("express");
const adminRouter = express.Router();
let path = require("path");
let mongoose = require("mongoose");
require("../Models/notificationModel");
let myNotificationModel = mongoose.model("notification");
adminRouter.get("/profile",(request,response,next) =>{
    if(request.session.role == "admin")
    {
        //List All Notifications
        myNotificationModel.find({}).populate({path : "speakerId eventId"}).sort({_id : -1}).limit(10).then((eventsArray)=>{
            response.render("adminProfile",{canceledEvents : eventsArray});
            next();
        }).catch((err) =>{
            console.log(err);
        })
    }
    else
        response.redirect("/login");
});
module.exports = adminRouter;