const express = require("express");
const eventRouter = express.Router();
let path = require("path");
var moment = require("moment");
// Get the models to Connect DB
let mongoose = require("mongoose");
require("./../Models/eventModel");
require("./../Models/notificationModel");
let eventModel = mongoose.model("event");
//Speaker Model
require("./../Models/speakerModel");
let speakerModel = mongoose.model("speaker");

let notificationModel = mongoose.model("notification");
eventRouter.use((request,response,next) =>{
    if(request.session.role == "admin")
    {
        //List All Events
        eventRouter.get("/list",(request,response) =>{
            eventModel.find({}).populate({path : "mainSpeaker otherSpeaker"}).then((eventsArray)=>{
                response.render("Events/eventsList",{events :eventsArray});
            }).catch((err) =>{
                console.log(err);
            })
        });

        //Delete Specified Event
        eventRouter.post("/delete",(request,response) =>{
            eventModel.findByIdAndDelete(request.body.speakerId).then((data) => {
                response.send(request.body.speakerId+"");
            }).catch((err) => {
                console.log(err);
            })
        });

        //Update Event Page
        eventRouter.get("/update/:_id",(request,response) =>{
            eventModel.find({}).populate({path : "mainSpeaker otherSpeaker"}).then((eventsArray)=>{
                let myEvent = eventsArray.find((elem) =>elem._id == request.params._id );
                speakerModel.find({}).then((speakers) =>{
                    response.render("Events/editEvent",{mySpeakers :speakers ,selectedEvent : myEvent,moment: moment});
                }).catch((err)=>{
                    console.log(err);
                });
            }).catch((err) =>{
                console.log(err);
            })
        });

        //Update Specified event
        eventRouter.post("/update",(request,response) =>{
            eventModel.findByIdAndUpdate(request.body._id,request.body).then((data) => {
                response.redirect("/event/list");
            }).catch((err) =>{
                console.log(err + "");
            });
        });

        //Add Event Page
        eventRouter.get("/add",(request,response) =>{
            eventModel.find({}).populate({path : "mainSpeaker otherSpeaker"}).then((eventsArray)=>{
                speakerModel.find({}).then((speakers) => {
                    response.render("Events/addEvent",{events :eventsArray,mySpeakers : speakers});
                }).catch((err) =>{
                    console.log(err);
                });
            }).catch((err) =>{
                console.log(err);
            })
        });

        //Add New Event
        eventRouter.post("/add",(request,response) =>{
            let myNewEvent = new eventModel(request.body);
            myNewEvent.save().then((data) => {
                response.redirect("/event/list");
            }).catch((err) => {
                console.log(err);
            });
        });
        next();
    }
    else if(request.session.role == "speaker")
    {
        //Cancel Specified Event
        eventRouter.post("/cancel",(request,response) =>{
            console.log(request.body);
            if(request.body.isMainSpeaker)
            {
                eventModel.updateOne({_id : request.body.eventId,mainSpeaker : request.body.speakerId} , { $unset : {"mainSpeaker" : ""}  
                }).then((data) =>{
                    response.send(request.body.speakerId + "");
                    console.log(request.body);  
                }).catch((err) =>{
                    console.log(err);
                });
            }
            else
            {
                console.log(request.body);
                eventModel.updateOne({_id : request.body.eventId,otherSpeaker : request.body.speakerId} , { $pull : {"otherSpeaker" :request.body.speakerId }  
                }).then((data) =>{
                    response.send(request.body.speakerId + "");
                }).catch((err) =>{
                    console.log(err);
                });
            }
            let myNotification = new notificationModel(request.body);
            myNotification.save().then((data) =>{
                console.log("speaker Deleted")
            }).catch((err) =>{
                console.log(err);
            })
            
            
        });
        next();
    }else
        response.redirect("/login");
})
module.exports = eventRouter;