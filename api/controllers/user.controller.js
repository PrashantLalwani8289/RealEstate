const User = require("../models/user.model");
const errorHandler = require("../utils/error");
const bcrypt = require('bcryptjs');

const test = (req,res) => {
    res.send('Hello World!');
}

const updateUser = async(req, res, next) => {
  console.log(req.params);
  console.log(req.user)
  if(req.user.id !== req.params.id){
    return next(errorHandler(401, "YOu can only update your own account"));
  }
  try {
    if(req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
    } 
    // const newUser = await User.find({email : req.body.email});
    // if(newUser){
    //     return res.status(401).json({msg : "User already exist"});
    // }
    const updatedUser = await  User.findByIdAndUpdate(req.params.id, {
        $set:{
            username : req.body.username,
            email:req.body.email,
            password:req.body.password,
            avatar:req.body.avatar
        }
    }, {new :true})
    const {password, ...rest} = updatedUser._doc;
    res.status(200).json({success: true , data: rest});
    
  } catch (err) {
    console.log(err);
      return next(errorHandler(500,"Error updating user", err));
  }
}

const deleteUser = async (req, res, next) => {
    if(req.user.id !== req.params.id){
      return next(errorHandler(401, "only delete Your account"));
    }
    try {
      await User.findByIdAndDelete(req.params.id);
      res.clearCookie('access_token')
      res.status(200).json({message : "User has been deleted"});
    } catch (error) {
      next(error)
    }
}

module.exports = {test, updateUser, deleteUser};