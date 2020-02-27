const express = require("express");
const speakerRouter = express.Router();
let path = require("path");

//TO Get the models to Connect DB
let mongoose = require("mongoose");
require("./../Models/speakerModel");
let speakerModel = mongoose.model("speaker");
require("./../Models/eventModel");
let eventModel = mongoose.model("event");
//=============================================
speakerRouter.use((request, response, next) => {
    if (request.session.role == "speaker") 
    {
        //Speaker Own Profile
        speakerRouter.get("/profile", (request, response) => {
            response.locals.speakerName = request.session.name;
            speakerModel.findById(request.session._id).then((mySpeaker) => {
                let speakerId = mySpeaker._id + "";
                eventModel.find({$or : [{ mainSpeaker: speakerId },{ otherSpeaker: speakerId } ]}).then((refEvent) => {
                    response.render("speakerProfile",{speakerData : mySpeaker ,currentEvent : refEvent});
                }).catch((err) => {
                    console.log(err);
                });
            }).catch((err) => {
                console.log(err);
            })
        });
        //Update Speaker Profile
        speakerRouter.post("/updateSpeakerProfile", (request, response) => {
            speakerModel.updateOne({ _id: request.session._id }, {
                $set:
                {
                    "fullName": request.body.fullName,
                    "username": request.body.username,
                    "password": request.body.password,
                    "address.city": request.body.city

                }
            }).then((data) => {
                request.session.name = request.body.fullName;
                response.redirect("/speaker/profile");
            }).catch((err) => {
                console.log(err);
            });
        });
        speakerRouter.get("/upcomingEvents",(request,response) =>{

            eventModel.find({}).populate({path : "mainSpeaker otherSpeaker"}).then((events) =>{
                response.locals.speakerName = request.session.name;
                response.render("Speakers/upcomingEvents",{events :events});
            }).catch((err) =>{
                console.log(err);
            })
        });
        next();
    }
    else if (request.session.role == "admin") {
        //List All Speakers
        speakerRouter.get("/list", (request, response) => {
            speakerModel.find({}).then((Data) => {
                response.render("Speakers/speakersList", { speakers: Data });
            }).catch((err) => {
                console.log(err + "");
            });
        });
        //Delete Selected Object
        speakerRouter.post("/delete", (request, response) => {
            console.log("The Object id is " + request.body);
            speakerModel.findByIdAndDelete(request.body.speakerId).then((data) => {
                response.send(request.body.speakerId + "");
            }).catch((err) => {
                console.log(err + "");
            });
        });
        //Update Page
        speakerRouter.get("/update/:id", (request, response) => {
            speakerModel.findOne({ _id: request.params.id }).then((selectedSpeaker) => {
                response.render("Speakers/editSpeaker", { speaker: selectedSpeaker });
            }).catch((err) => {
                console.log(err);
            });
        });
        //Update Speaker
        speakerRouter.post("/update", (request, response) => {
            speakerModel.updateOne({ _id: request.body._id }, {
                $set:
                {
                    "fullName": request.body.fullName,
                    "username": request.body.username,
                    "password": request.body.password,
                    "address.city": request.body.city

                }
            }).then((data) => {
                response.redirect("/speaker/list");
            }).catch((err) => {
                console.log(err);
            });
        });

        //add Speaker Page
        speakerRouter.get("/add", (request, response) => {
            speakerModel.findOne({ _id: request.params.id }).then((selectedSpeaker) => {
                response.render("Speakers/addSpeaker", { speaker: selectedSpeaker });
            }).catch((err) => {
                console.log(err);
            });
        });

        //Add New Speaker Using 
        speakerRouter.post("/add", (request, response) => {
            let newSpeaker = new speakerModel({
                "fullName": request.body.fullName,
                "username": request.body.username,
                "password": request.body.password,
                "address.city": request.body.city,
                "address.street": request.body.street,
                "address.building": request.body.building,
            });
            newSpeaker.save().then((data) => {
                response.redirect("/speaker/list");
            }).catch((err) => {
                console.log(err);
            });
        });
        next();
    }
    else
        response.redirect("/login");
});
module.exports = speakerRouter;