let mongoose = require("mongoose");
let eventSchema = new mongoose.Schema({
    _id : Number,
    title : String,
    date : Date,
    mainSpeaker : {type : Number ,ref :"speaker"},
    otherSpeaker : [{type : Number,ref : "speaker"}]
});
//mapping
mongoose.model("event",eventSchema);