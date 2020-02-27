let mongoose = require("mongoose");
var autoIncrement = require('mongoose-auto-increment'); //1. Require Auto Increment Package
let speakerSchema = new mongoose.Schema({
    fullName : String,
    username : String,
    password : String,
    email : String,
    address : {
        city : String,
        street : String,
        building : String
    }
});
autoIncrement.initialize(mongoose.connection); // 2. initialize autoIncrement 
speakerSchema.plugin(autoIncrement.plugin, 'speaker'); // 3. use autoIncrement

//mapping
mongoose.model("speaker",speakerSchema);