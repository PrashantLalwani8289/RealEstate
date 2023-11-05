const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err)
})

const app = express();


app.listen(3000, () => {
    console.log("Server is running on port 3000");
})