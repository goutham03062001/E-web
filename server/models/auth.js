const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    name: {
        type : String,
        required:true
    },
    email:{
        type : String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gravatar:{
        type : String,
    },
    location:{
        type : String,
        required:true
    },
    
    createdAt:{
        type : Date, default: Date.now()
    }
});

module.exports = User = new mongoose.model("user",UserSchema)