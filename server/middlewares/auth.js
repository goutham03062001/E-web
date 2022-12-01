const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

module.exports = function (req, res, next) {
  //get the token from header

  const token = req.header('x-auth-token');//using this we will send the token
  // console.log('token is : ',token)
  //check if no token

  if (!token) {
    return res.status(401).json({ message: "no token, authorization denied" });
  } else {
    //verify the token

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //if the user is registered and got token then here it will be decoded
      //and will be assigned to the present user

      req.user = decoded.user;

      //decoded.user contains the id of the jsonwebtoken id

      next();
    } catch (error) {
      console.log("Token is not valid : ", error.message);
    }
  }
};
