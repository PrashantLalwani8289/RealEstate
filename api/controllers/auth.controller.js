const User = require("../models/user.model");
const bcryptjs = require("bcryptjs"); 
const errorHandler = require('../utils/error')
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const {username, email, password} = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username, email, password:hashedPassword});
    try {
        await newUser.save();
    res.status(201).json({msg : "User created Succesfully"});
    } catch (error) {
        next(error);
    }
    
}

const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const validUser = await User.findOne({email});
        if(!validUser){
            return next(errorHandler(404,"User Not found!"));
        }
        const isValidPass = bcryptjs.compareSync(password, validUser.password);
        if (!isValidPass){
            return next(errorHandler(401,'Wront Credentials'));
        }
        const token = jwt.sign({id: validUser._id},process.env.JWT_SECRET);
        const {password : pass, ...rest} = validUser._doc;
        console.log({token});
        res.cookie('access_token', token ,{httpOnly: true}).status(200).json(rest);


    } catch (error) {
        next(error)
    }
}

const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email : req.body.email});
        if(user){
            const token = jwt.sign({id : user._id}, process.env.JWT_SECRET);
            const {password : pass, ...rest} = user._doc;
            res.cookie('access_token', token ,{httpOnly: true}).status(200).json(rest);
        }else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User({username: req.body.name.split(' ').join("").toLowerCase() +  Math.random().toString(36).slice(-4) , email: req.body.email, password: hashedPassword, avatar: req.body.photo});
            await newUser.save();
            const token = jwt.sign({id: newUser._id},process.env.JWT_SECRET);
            const {password : pass, ...rest} = newUser._doc;
            res.cookie('access_token', token ,{httpOnly: true}).status(200).json(rest);

        }
    } catch (error) {
        next(error);
    }
}

const signout  = (req, res, next) =>{
    try{
    console.log(localStorage)
    res.clearCookie();
    console.log("signout")
    
    }
    catch(error){
        next(error);
    }
};




module.exports = {signup, signin, google, signout};