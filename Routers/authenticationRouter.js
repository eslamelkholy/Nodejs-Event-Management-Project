const express = require("express");
const authenticationRouter = express.Router();
let path = require("path");

//Fetch Database Speakers
let mongoose = require("mongoose");
require("./../Models/speakerModel");
let speakers = mongoose.model("speaker");
//Express Validator
const { check, validationResult } = require('express-validator');

//Get Login
authenticationRouter.get("/login", (request, response) => {
    response.render("Authentication/login");
});
//Post Login Validation
authenticationRouter.post("/login", (request, response, next) => {
    if (request.body.username == "eslam" && request.body.password == "123") {
        // request.session._id = 0;
        request.session.role = "admin";
        response.redirect("/admin/profile");
        next();
    }
    else 
    {
        speakers.findOne(request.body).then((speaker) => {
            if (speaker) {
                request.session._id = speaker._id;
                request.session.name = speaker.fullName;
                response.locals.speakerName = request.session.name;
                request.session.role = "speaker";
                response.redirect("/speaker/profile");
                next();
            }
            else
            {
                request.flash("failedLogin","Sorry Username or Password Doesn't Exist Please Enter a Valid Data!");   
                response.locals.message = request.flash();
                response.render("Authentication/login");
            }
        }).catch((err) => {
            console.log(err);
        });
    }
});
//Register get Page
authenticationRouter.get("/register", (request, response) => {
    response.render("Authentication/register");
});

//Register Post Page
authenticationRouter.post("/register", [check('password').isLength({ min: 3 }),
        check("username").isLength({min : 5}),
        check("email").isEmail(),
        check("fullName").isLength({min : 5}),
        check("address").isLength({min : 5})
    ], (request, response) => {

    //Check the Errors Array
    const errors = validationResult(request);
    if (errors.isEmpty()) 
    {
        let newSpeaker = new speakers({
            "fullName": request.body.fullName,
            "username": request.body.username,
            "password": request.body.password,
            "email" : request.body.email,
            "address.city": request.body.city,
            "address.street": request.body.street,
            "address.building": request.body.building,
        });
        newSpeaker.save().then((data) => {
            response.redirect("/login");
        }).catch((err) => {
            console.log(err);
        });
    }
    else
    {
        errors.array().forEach((err) =>{
            var errorName = err.param;
            console.log(errorName);
            request.flash(errorName,errorName);
        });
        response.locals.message = request.flash();
        response.render("Authentication/register");
    }
});

//Logout Page & Destroy Session
authenticationRouter.get("/logout", (request, response) => {
    request.session.destroy((err) => {
        if (err)
            return console.log(err);
        response.redirect("/login");
    })
});
module.exports = authenticationRouter;