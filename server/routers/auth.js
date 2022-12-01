const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/auth");
const auth = require("../middlewares/auth")

//@router      POST /api/auth/signup
//@desc        user registration
//@access      Public
router.post("/signup",async(req,res)=>{
    try {
        const {name, email, password,location} = req.body;
        const isExisted = await User.findOne({email});
        if(isExisted){return res.send('this email is already existed')}
        else{
            const user = new User({name, email, password,location});
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password,salt);
            
            //send json web token
            const payload = {
                user : {
                    id : user.id
                }
            }
            jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:36000},(err,token)=>{
                if(err) throw err;
                else{
                    res.json({token,message:"Registered Successfully"});
                }
            })
            await user.save();

            
        }
    } catch (error) {
        console.log(error.message)
    }
})

//@route    POST /api/login
//@desc     user login
//@access   Private
router.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(user){
            //check for the password
            bcrypt.compare(password,user.password,(err,data)=>{
                if(err){throw err}
                if(data){
                    //send json web token
                    const payload = {
                        user : {
                            id : user.id
                        }
                    }
                    jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:36000},(err,token)=>{
                        if(err) throw err;
                        else{
                            res.json({token,message : 'Logged in successfully'});
                        }
                    })
                }
                if(!data){res.send(' password is wrong')}
            })
        }
        else{
            res.send('No email is found')
        }
    } catch (error) {
        console.log(error.message)
    }
});


//@route    GET api/auth/me
//@desc     get user details
//@access   Private
router.get("/me", auth, async(req, res)=>{
    try {
        const user = await User.findOne({id : req.params.id}).select('-password');
        if(!user){return res.send('No user found')}
        else{return res.send(user)}
    } catch (error) {
        console.log('error',error.message)
    }
})

module.exports = router;