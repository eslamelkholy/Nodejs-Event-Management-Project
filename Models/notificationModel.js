let mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment'); //1. Require Auto Increment Package
let notificationSchema = new mongoose.Schema({
    speakerId : {type : Number ,ref :"speaker"},
    eventId : {type : Number ,ref :"event"},
    isMainSpeaker : Boolean
});
autoIncrement.initialize(mongoose.connection); // 2. initialize autoIncrement 
notificationSchema.plugin(autoIncrement.plugin, 'notification'); // 3. use autoIncrement

//mapping
mongoose.model("notification",notificationSchema);