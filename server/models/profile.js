const mongoose = require("mongoose");
const profileSchema = mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  CollegeBranches: { type : String},
  userId:{
    type : mongoose.Schema.Types.ObjectId,
    ref:'user'
  },
  //branches is also array of objects
  branches: [
       {
        name : {type:String,required:true},
        Hod:{type:String,required:true},
        branchPhoto:{type:String},
        students:[
          {
            name:{type:String},
            roll:{type:String},
            age:{type:String},
            gender:{type:String},
            profile:{type:String}
          }
        ]
       }
  ]
});

module.exports = Profile = mongoose.model("profile", profileSchema);
