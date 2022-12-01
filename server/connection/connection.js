const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL,{useNewUrlParser:true})
    .then((success)=>{console.log('Connected to db')})
    .catch((err)=>{console.log('error',err.message)})