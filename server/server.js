const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({path:'./config.env'});
const connection = require("./connection/connection");
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");
//InBuilt middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(fileUpload({
    useTempFiles:true
}));

const auth = require("./routers/auth");
const profile = require("./routers/profile")
app.use("/api/auth",auth);
app.use("/api/profile",profile);


app.listen(process.env.PORT,()=>{
    console.log('running on port :',process.env.PORT)
})