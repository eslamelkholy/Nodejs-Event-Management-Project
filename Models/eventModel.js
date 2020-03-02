let mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment'); //1. Require Auto Increment Package
let eventSchema = new mongoose.Schema({
    title : String,
    date : Date,
    mainSpeaker : {type : Number ,ref :"speaker"},
    otherSpeaker : [{type : Number,ref : "speaker"}]
});
autoIncrement.initialize(mongoose.connection); // 2. initialize autoIncrement 
eventSchema.plugin(autoIncrement.plugin, 'event'); // 3. use autoIncrement
//mapping
mongoose.model("event",eventSchema);