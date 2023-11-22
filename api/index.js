const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors')


const userRouter = require('./routes/user.route');
const authRouter = require('./routes/auth.route');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json())
app.use(cookieParser());
app.use(cors())

app.use('/api/user',userRouter );
app.use('/api/auth', authRouter);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err)
})

 


app.listen(5000, () => {
    console.log("Server is running on port 3000");
})



app.use((err, req, res, next) => {
    const statusCode =  err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success : false,
        statusCode,
        message
    }) 
})