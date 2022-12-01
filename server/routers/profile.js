const { response } = require("express");
const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const Profile = require("../models/profile");
const cloudinary = require("cloudinary");
//Cloudinary Configuration
cloudinary.config({
  cloud_name : process.env.CLOUD_NAME,
  api_key : process.env.API_KEY,
  api_secret : process.env.API_SECRET
})

//@route    POST /api/profile/
//@desc     Create profile
//@access   Private
router.post("/", auth, async (req, res) => {
  try {
    const { name, location, CollegeBranches } = req.body;
    const profile = await Profile.findOne({ userId : req.user.id });
    if (profile) {
      return res.send("Profile already existed");
    } else {
      const userId = req.user.id;
      const newProfile = new Profile({ name, location, CollegeBranches ,userId});
      await newProfile.save();
      res.json({newProfile,message:"profile created successfully"});
    }
  } catch (error) {
    console.log(error.message);
  }
});
//@route    GET /api/profile/:id
//@desc     Get profile
//@access   Private
router.get("/:id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.send("No Profile Found");
    } else {
      return res.send(profile);
    }
  } catch (error) {
    console.log(error.message);
  }
});

//@route    GET /api/profile
//@desc     Get all profile
//@access   Private
router.get("/", auth, async (req, res) => {
  try {
    const profile = await Profile.find({});
    if (!profile) {
      return res.send("No Profiles Found");
    } else {
      return res.send(profile);
    }
  } catch (error) {
    console.log(error);
  }
});

//@route    POST /api/profile/branch/:branchId/createStudent
//@desc     Create a new student
//@access   Private
router.get("/:id/branchDetails/:branchId", auth, async (req, res) => {
  try {
    // console.log('branch id',branchId);

    // res.send({
    //         profile : req.params.id,branch : req.params.branchId
    // })

    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.send("No Profile Found");
    } else {
      profile.branches.map((ele) => {
        console.log(ele.name);
      });
      profile.branches.map((branch) => {
        if (branch._id.toString() === req.params.branchId) {
          return res.send(branch);
        }
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});
//@route    GET /api/profile/branch/:branchId/getAllStudents
//@desc     Get all students by branch id
//@access   Private
router.get(
  "/branchDetails/:branchId/getAllStudents",
  auth,
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ userId: req.user.id });
      if (!profile) {
        return res.send("No Profile Found");
      } else {
        profile.branches.map((ele) => {
          res.send(ele.students);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);



//@route    PUT /api/profile/branchDetails/:branchId/studentDetails/:studentId/uploadProfile
//@desc     upload profile
//@access   Private
router.put('/branchDetails/:branchId/studentDetails/:studentId/uploadProfile',auth,async(req,res)=>{
  try {
    console.log(req.url);
    console.log(req.statusCode)
    const profile = await Profile.findOne({userId : req.user.id});
    if(!profile){return res.send('No Profile Found')}
    profile.branches.map(branch=>{
      if(branch._id.toString() === req.params.branchId){
        branch.students.map(student=>{
          if(student._id.toString() === req.params.studentId){
            student.profile = req.body.profile;
            res.json(student);
          }
        })
      }
    })
    await profile.save();
    
  } catch (error) {
    console.log('Server Error');
  }
})

//@route    GET /api/profile/:id/branchDetails/:branchId/student/:studentId
//@desc     Get Student By branch id
//@access   Private
router.get(
  "/branchDetails/:branch/studentDetails/:id",
  auth,
  async (req, res) => {
    
    const branchId = req.params.branch;
    const studentId = req.params.id;
    // console.log("branchId",branchId,"studentId",studentId)
    try {
      const profile = await Profile.findOne({ userId: req.user.id });
      if (!profile) {
        return res.send("No Profile Found");
      } else {
        profile.branches.map((branch) => {
          if (branch._id.toString() === branchId) {
            branch.students.map((student) => {
              if (student._id.toString() === studentId) {
                // if(!name || !age || !gender || !roll){return res.send('Please fill all the details')}
               
                res.json(student);
                
                
              
              }
            });
          }
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);

//@route    POST /api/profile/branch/:branchId/createStudent
//@desc     Create student by branch id
//@access   Private
router.post(
  "/branch/:branchId/createStudent",
  auth,
  async (req, res) => {
    try {
      const newprofile = await Profile.findOne({ userId: req.user.id });
      if (!newprofile) {
        return res.send("No Profile Found");
      } else {
        const { name, roll, age, gender ,profile} = req.body;
        const studentObj = { name, roll, age, gender ,profile};
        newprofile.branches.map((branch) => {
          if (branch._id.toString() === req.params.branchId) {
            branch.students.push(studentObj);
          }
        });
        await newprofile.save();
        res.json({ message: "Student Created"});
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);


//@route    PUT /api/profile/branch/:branchId/students/:studentId
//@desc     update student by id
//@access   Private
router.put("/branch/:branchId/students/:studentId", auth, async(req,res)=>{
  try {
    const{name,roll,age,gender} = req.body;
    const profile = await Profile.findOne({userId : req.user.id});
    if(!profile){return res.send('Profile not found')}
    else{
      profile.branches.map(branch=>{
        if(branch._id.toString() === req.params.branchId){
          branch.students.map(student=>{
            if(student._id.toString() === req.params.studentId){
              if(name) {student.name = name;}
              if(roll) {student.roll = roll;}
              if(age){student.age = age;}
             if(gender) {student.gender = gender;}
            }
          })
        }
      });

      //save the doc
      await profile.save();
      res.json({message : "Student details updated"})
    }
  } catch (error) {
    console.log(error.message)
    
  }
})
//@route    PUT /api/profile/:id/branch/createBranch
//@desc     update branch
//@access   Private
router.put("/branch/createBranch", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.send("No Profile Found");
    } 
    else{
      
      const {name,Hod,branchPhoto} = req.body;
      const newBranch = {name,Hod,branchPhoto};
      profile.branches.push(newBranch);
      await profile.save();
      res.json({message : "Profile Updated",profile});
    }
  } catch (error) {
    console.log(error.message);
  }
});

//@route    PUT /api/profile/:id/branch/:branchId
//@desc     Update branch by id
//@access   Private
router.put("/:id/branchDetails/:branchId", auth, async (req, res) => {
  const { name, Hod } = req.body;
  try {
    const profile = await Profile.findOne({ userId: req.params.id });
    if (!profile) {
      return res.send("No Profile Found");
    } else {
      profile.branches.map((branch) => {
        if (branch._id.toString() === req.params.branchId) {
          branch.name = name;
          branch.Hod = Hod;
          profile.save();
          return res.json({
            message: "Branch Details Updated Successfully",
            
          });
        }
      });
    }
  } catch (error) {
    console.log(error.message);
  }
});

//@route    GET /api/profile/branch/getAllBranches
//@desc     Get all branches
//@access   Private
router.get('/branches/getAllBranches', auth, async(req,res)=>{
  try {
    const profile = await Profile.findOne({ userId : req.user.id});
    if(!profile){return res.send('No Profile Found')}
    else{
      res.send(profile.branches)
    }
  } catch (error) {
    console.log(error.message)
  }
})
module.exports = router;
