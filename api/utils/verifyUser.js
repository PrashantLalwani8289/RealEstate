const jwt = require('jsonwebtoken');
const errorHandler = require('./error');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token){
        return res.status(401).json({message: 'No token provided'});
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
        if (err){
            return next(errorHandler(401, "Forbidden"));
        } 
        req.user = user;
        next();
    })
}
  
module.exports = verifyToken;